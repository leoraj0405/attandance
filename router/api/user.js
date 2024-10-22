const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");


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

const SINGLE_GET_QUERY = /*sql*/`SELECT * FROM user WHERE id = ?`


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
        con.query(SINGLE_GET_QUERY, [id], (err, result) => {
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

        const randomString =  randomstring.generate({
            length: 6
        });     
        console.log(randomString)

        con.query(/*sql*/`SELECT email FROM user WHERE email = ?`,[email], (err1, result1) => {
            if (result1 == 0 ){
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
                    if(result.affectedRows == 0){
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
                        if(err){
                            res.status(409).send('Email Error : '+err.message)
                        }else{
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

router.get('/', getUser)
router.post('/', insertorUpdateUser)
router.delete('/:id', deleteUser)
router.get('/:id', getSingleUser)
router.post('/login', loginUser)
router.get('/authorized/home', homeUser)
router.get('/login/logout', logoutUser)
router.put('/restPassword', restPassword)
module.exports = router;