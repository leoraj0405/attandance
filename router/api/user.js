const express = require('express');
const router = express.Router();
const randomstring = require("randomstring");
const otpGenerator = require('otp-generator');
const sendMail = require('../../utils/email');
const execQuery = require('../../utils/query');

const LENGTH_OF_OTP = 6;
const PATRERN_OF_OTP = {
    upperCaseAlphabets: true,
    specialChars: false,
    lowerCaseAlphabets: false
}



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
                async (err, result) => {
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
                    const mailOptions = {
                        to: email,
                        subject: 'Send By SH Team',
                        text: `Your new password is ${randomString}`
                    }

                    try {
                        const emailResult = await sendMail(mailOptions)                        
                    } catch (error) {
                        console.log(error)
                    }
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

async function processOtp(req, res) {

    const currentTime = new Date().getTime();
    const {
        emailId
    } = req.body

    try {
        // Validate email length
        if (emailId.length == 0) {
            rs.status(400).send('Invalid email input')
            return
        }

        const userResult = await execQuery(/*sql*/`SELECT 
            email,
            unBlockTime 
            FROM user 
            WHERE email = ? 
            AND deletedAt IS NULL`, [emailId])            
            
        if (!userResult.length) {
            res.status(404).send('Invalid Email ID')
            return
        }

        const unBlockTime = new Date( userResult[0].unBlockTime).getTime();

        if (currentTime >= unBlockTime) {
            const otp = otpGenerator.generate(LENGTH_OF_OTP, PATRERN_OF_OTP);
            const otpUpdateRes = await execQuery(/*sql*/`UPDATE user 
                SET otp = ?
                    unBlockTime = null, 
                    otpAttempt = 0 
                WHERE email = ? 
                AND deletedAt IS NULL`, [otp, emailId])

            if (otpUpdateRes.affectedRows == 0) {
                res.status(502).send('Not updated in DB')
                return
            }

            const mailOptions = {
                to: emailId,
                subject: 'Send By SH team for rest password ',
                text: `Your new otp is ${otp}`
            }
            await sendMail(mailOptions)
            res.status(200).send('OTP sent : ' + info.response)
        } else {
            res.status(401).send('user blocked')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
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

router.post('/warden/processotp', processOtp)
router.put('/warden/validate/otp', validateOtpSavePassword)

module.exports = router;
