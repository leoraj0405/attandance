const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const otpGenerator = require('otp-generator');
const email = require('../../emailBody');
const { ContentInstance } = require('twilio/lib/rest/content/v1/content');
const { get } = require('http');



const lengthOfotp = 6;
const patternOfOtp = {
    upperCaseAlphabets: true,
    specialChars: false,
    lowerCaseAlphabets: false
}


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'attendance'
})

const allowedUpdateKey = [
    'firstName',
    'lastName',
    'phoneNo',
    'email',
    'userId',
    'password',
]

const GET_QUERY = /*sql*/ `SELECT *,
                            DATE_FORMAT(createdAt, "%D %M %Y")
                            AS createdAt 
                            FROM user
                            WHERE deletedAt IS NULL`

const INSERT_QUERY = /*sql*/` INSERT INTO user 
                                ( firstName, lastName, phoneNo, email, userId, password, isAdmin) 
                                VALUES
                                (?,?,?,?,?,?,?) 
                                ON DUPLICATE KEY UPDATE 
                                firstName = VALUES(firstName),
                                lastName = VALUES(lastName),
                                phoneNo = VALUES(phoneNo),
                                email = VALUES(email),
                                password = VALUES(password),
                                isAdmin = VALUES (isAdmin)`



function getUser(req, res) {
    try {
        con.query(GET_QUERY, (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            }
            res.status(200).send(result)
        })
    } catch (error) {
        console.error(error)
    }
}

function insertorUpdateUser(req, res) {
    try {
        var {
            firstName,
            lastName,
            phoneNo,
            email,
            userId,
            password,
            isAdmin
        } = req.body;

        var userInput = [
            firstName,
            lastName,
            phoneNo,
            email,
            userId,
            password,
            isAdmin
        ]
        if (firstName.length > 0 && lastName.length > 0 && phoneNo.length > 0 && email.length > 0 && userId.length > 0 && password.length > 0 && isAdmin.length > 0) {
            con.query(INSERT_QUERY, userInput, (err, result) => {
                if (err) {
                    res.status(409).send(err.sqlMessage)
                    return
                }
                if (result.affectedRows != 0) {
                    res.status(200).send("insert successfully")
                }
            })

        } else {
            res.status(409).send('Input empty')
            return
        }
    } catch (error) {
        console.error(error)
        return
    }
}

function deleteUser(req, res) {
    try {
        const delId = req.params.id;
        const sqlQuery = /*sql*/` UPDATE user SET deletedAt = CURRENT_TIMESTAMP WHERE id = ${delId}`

        con.query(sqlQuery, (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            }
            if (result.affectedRows != 0) {
                res.status(200).send('delete successfully')
            } else {
                res.status(409).send('Invalid User')
                return
            }
        })

    } catch (error) {
        console.error(error)
    }

}

function getSingleUser(req, res) {
    try {
        const id = req.params.id;
        con.query(/*sql*/`SELECT * FROM user WHERE id = ?`, [id], (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            }
            res.status(200).send(result[0])
        })

    } catch (error) {
        console.error(error)
    }
}

function restPassword(req, res) {
    try {
        const {
            email,
        } = req.body;

        const randomString = randomstring.generate({
            length: 6
        });
        console.log(randomString)

        con.query(/*sql*/`SELECT email FROM user WHERE email = ?`, [email], (err1, result1) => {
            if (result1 == 0) {
                res.status(409).send('Invalid Email Id')
                return
            }
            con.query(/*sql*/`UPDATE user SET password = ? WHERE email = ?`,
                [randomString, email],
                (err, result) => {
                    if (err) {
                        res.status(409).send(err.sqlMessage)
                        return
                    }
                    console.log(result)
                    if (result.affectedRows == 0) {
                        console.log(result)
                        res.status(409).send('API Error : Reset Password Unsccessfull')
                        return
                    }
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'leo006401@gmail.com',
                            pass: 'brvp easj ulag yjum'
                        }
                    });
                    const mailOptions = {
                        from: 'leo006401@gmail.com',
                        to: email,
                        subject: 'Send By SH Team',
                        text: `Your new password is ${randomString}`
                    }

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            res.status(409).send('Email Error : ' + err.message)
                        } else {
                            res.status(200).send('Password Reseted Your password sent to your email')
                        }

                    })
                })


        })

    } catch (error) {
        console.log(error)
    }
}

async function loginUser(req, res) {
    try {
        const {
            userId,
            password
        } = req.body;

        const query = /*sql*/` SELECT id,firstName,isAdmin FROM user WHERE userId = ? AND password = ? `

        await con.query(query, [userId, password], async (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            }
            if (result.length > 0) {
                req.session.isLogged = true;
                req.session.data = result[0];
                res.status(200).send('SUCCESS ')
            }
            else {
                req.session.isLogged = false;
                req.session.data = null;
                res.status(409).send('Invalid user and/or password')
            }

        })


    } catch (error) {
        console.error(error)
    }
}

function homeUser(req, res) {
    try {
        if (req.session.isLogged) {
            const result = req.session.data
            res.status(200).send("Welcome " + result)
        }
        else {
            res.status(409).send("Please Login again")
            return
        }
    } catch (error) {
        console.error(error)
    }
}

function logoutUser(req, res) {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.send(err)
                return
            }
            res.send('session destroy')
        });

    } catch (error) {
        console.error(error)
    }
}

function generateOtpAndSendOtp(req, res) {
    try {
        const currentTime = new Date().getTime();

        const {
            emailId
        } = req.body
        if (emailId.lenght == 0) {
            rs.status(400).send('Invalid email input')
            return
        }
        con.query(/*sql*/`SELECT unBlockTime FROM user WHERE email = ? AND deletedAt IS NULL`, [emailId], (err, result) => {
            if (err) {
                console.log(err)
                res.status(502).send(err.sqlMessage)
                return
            }
            const unBlockTime = new Date(result[0].unBlockTime).getTime();
            if (currentTime >= unBlockTime) {
                con.query(/*sql*/`UPDATE user SET unBlockTime = null, otpAttempt = 0 WHERE email = ?`, (emailId), (unBlockErr, unBlockResult) => {
                    if (unBlockErr) {
                        res.status(502).send(unBlockErr.sqlMessage)
                        return
                    }
                })
            }
            // con.query(/*sql*/`SELECT email,unBlockTime FROM user WHERE email = ? AND deletedAt IS NULL`, [emailId], (err1, result1) => {
            //     if (err1) {
            //         console.log(err1)
            //         res.status(502).send(err1.sqlMessage)
            //         return
            //     }
            // if (!result1.length) {
            //     res.status(404).send('Invalid Email ID')
            //     return
            // }
            const isBlocked = result1[0].unBlockTime
            if (isBlocked) {
                res.status(401).send('User Blocked')
                return
            }
            const otp = otpGenerator.generate(lengthOfotp, patternOfOtp);
            const transporter = nodemailer.createTransport(email.emailUserAndPassword);
            const mailOptions = {
                from: email.fromAddress,
                to: emailId,
                subject: 'Send By SH team for rest password ',
                text: `Your new otp is ${otp}`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                }
                con.query(/*sql*/`UPDATE user SET otp = ? WHERE email = ?`,
                    [otp, emailId],
                    (otpUpdateErr, otpUpdateRes) => {
                        if (otpUpdateErr) {
                            res.status(502).send(otpUpdateErr.sqlMessage)
                            return
                        }
                        if (otpUpdateRes.affectedRows == 0) {
                            res.status(502).send('Not updated in DB')
                            return
                        }
                        res.status(200).send('OTP sent to you ' + info.response)

                    })
            });
        })
    })

    } catch (error) {
        console.error(error)
    }

}
function validateOtpSavePassword(req, res) {
    try {
        const currentTime = new Date().getTime();
        const otpAttemptMax = 3;
        const { otp, emailId, password } = req.body;

        if (!emailId || !otp || otp.length < 6) {
            res.status(400).send('Invalid Email or OTP');
            return;
        }

        con.query(`SELECT otp, otpAttempt, unBlockTime FROM user WHERE email = ?`, [emailId], (getOtpErr, getOtpResult) => {
            if (getOtpErr) {
                res.status(502).send(getOtpErr.sqlMessage);
                return;
            }

            if (!getOtpResult.length) {
                res.status(404).send('Invalid Email');
                return;
            }

            const userOtp = getOtpResult[0].otp;
            const unBlockTime = new Date(getOtpResult[0].unBlockTime).getTime();
            const currentOtpAttempt = getOtpResult[0].otpAttempt || 0;



            if (currentTime < unBlockTime) {
                res.status(401).send('You are blocked. Try again after the unblock time.');
                return;
            }

            if (currentOtpAttempt >= otpAttemptMax) {
                con.query(`UPDATE user SET unBlockTime = DATE_ADD(NOW(), INTERVAL 3 HOUR) WHERE email = ?`, [emailId], (blockErr, blockResult) => {
                    if (blockErr) {
                        res.status(502).send(blockErr.sqlMessage);
                        return;
                    }
                    res.status(401).send('You are blocked for the next 3 hours.');
                });
                return;
            }

            if (userOtp !== otp) {
                con.query(`UPDATE user SET otpAttempt = otpAttempt + 1 WHERE email = ?`, [emailId], (attemptErr) => {
                    if (attemptErr) {
                        res.status(502).send(attemptErr.sqlMessage);
                        return;
                    }
                    res.status(404).send('Invalid OTP');
                });
                return;
            }
            con.query(`UPDATE user SET password = ? WHERE email = ?`, [password, emailId], (restErr, restResult) => {
                if (restErr) {
                    res.status(502).send(restErr.sqlMessage);
                    return;
                }

                if (restResult.affectedRows > 0) {
                    con.query(`UPDATE user SET otp = NULL, unBlockTime = NULL, otpAttempt = 0 WHERE email = ?`, [emailId], (mtOtpErr) => {
                        if (mtOtpErr) {
                            res.status(502).send(mtOtpErr.sqlMessage);
                            return;
                        }
                        res.status(200).send('Password Updated');
                    });
                } else {
                    res.status(500).send('Password update failed');
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

router.get('/', getUser)
router.post('/', insertorUpdateUser)
router.delete('/:id', deleteUser)
router.get('/:id', getSingleUser)
router.post('/login', loginUser)
router.get('/authorized/home', homeUser)
router.get('/login/logout', logoutUser)
router.put('/restPassword', restPassword)
router.post('/warden/generateOtp', generateOtpAndSendOtp)
router.put('/warden/validate/otp', validateOtpSavePassword)

module.exports = router;
