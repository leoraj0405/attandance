const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const otpGenerator = require('otp-generator')

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

function generateOtp(req, res) {

    try {
        const {
            emailId
        } = req.body
    
        const otp = otpGenerator.generate(6,
            { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    
        con.query(/*sql*/`SELECT email FROM user WHERE email = ?`, [emailId], (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            }
            if (result.length == 0) {
                res.status(409).send('Invalid Email ID')
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
                to: emailId,
                subject: 'Send By SH team',
                text: `Your new otp is ${otp}`,
                attachments: [
                    {
                        filename: 'demo.txt',
                        path: './demo.txt'
                    },
                ]
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    return
                }
    
                req.session.data = {
                    email : emailId,
                    otp: otp
                };
                // const currentOtp = req.session.data.otp;
                res.status(200).send('OTP sent to you ' + info.response)
    
            });
        })
      
    } catch (error) {
        console.error(error)
    }

}
function validateOtp(req, res) {
    try {
        const {
            otp,
            emailId
        } = req.body
    
        const currentOtp = req.session.data.otp;
        const currentEmail = req.session.data.email;

        if (currentOtp == otp && emailId == currentEmail) {
            req.session.isOtpVerifyed = true
            res.status(200).send('Verifyed OTP')
        } else {
            req.session.isOtpVerifyed = false
            res.status(409).send('Invalid OTP')
        }
    } catch (error) {
       console.error(error) 
    }

}

function restPassword2(req, res) {
    try {
        const {
            emailId,
            password
        } = req.body;
        if(req.session.isOtpVerifyed) {
            // console.log(req.session.isOtpVerifyed)
            con.query(/*sql*/`UPDATE user SET password = ? WHERE email = ?`,[password, emailId], (err, result) =>{
                if (err){
                    res.status(409).send(err.sqlMessage)
                    return
                }
                if(result.affectedRows > 0) {
                    res.status(200).send('Password Updated')
                }
            });
        }
    } catch (error) {
        console.error(error)
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
router.post('/warden/generateOtp', generateOtp)
router.post('/warden/validate/otp', validateOtp)
router.put('/restPassword2', restPassword2)
module.exports = router;