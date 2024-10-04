const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const { use } = require('./user');

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
                                ( firstName, lastName, phoneNo, email, userId, password) 
                                VALUES
                                (?,?,?,?,?,?)`

const SINGLE_GET_QUERY = /*sql*/`SELECT * FROM user WHERE id = ?`

UPDATE_PASS_QUERY = /*sql*/`UPDATE user SET password = ? WHERE id = ?`;

GET_UDERID_QUERY = /*sql*/`SELECT id, userId FROM user`


function getUser(req, res) {
    try {
        con.query(GET_QUERY, (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            }
            const name = result[0].firstName
            res.status(200).send(result)
        })
    } catch (error) {
        console.error(error)
    }
}

function insertUser(req, res) {
    try {
        var {
            firstName,
            lastName,
            phoneNo,
            email,
            userId,
            password,
        } = req.body;

        var userInput = [
            firstName,
            lastName,
            phoneNo,
            email,
            userId,
            password
        ]
        if (firstName.length > 0 && lastName.length > 0 && phoneNo.length > 0 && email.length > 0 && userId.length > 0 && password.length > 0) {
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

function updateUser(req, res) {
    try {
        const id = req.params.id;
        const columnName = []
        const values = []
        allowedUpdateKey.forEach((keys) => {
            var keyvalue = req.body[keys]
            if (keyvalue !== undefined) {
                values.push(keyvalue)
                columnName.push(`${keys} = ?`)
            }
        })
        const UPDATE_QUERY =  /*sql*/`UPDATE user SET ${columnName},
                                        updatedAt = CURRENT_TIMESTAMP() 
                                        WHERE id = ${id}`
        con.query(UPDATE_QUERY, values, (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            }
            if (result.affectedRows != 0) {
                con.query(SINGLE_GET_QUERY, [id], (err2, result2) => {
                    if (err2) {
                        res.status(409).send(err2.sqlMessage)
                        return
                    }
                    res.status(200).send(result2[0])
                })
            }
        })

    } catch (error) {
        console.error(error)
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

function forgetPass(req, res) {
    try {
        const id = req.params.id;
        const pass = req.body.password;
        const responseData = {}

        con.query(GET_UDERID_QUERY,(err2 ,result2) => {
            if(err2) {
                res.status(409).send(err2.sqlMessage)
                return
            }
            responseData.userId = result2
        })
        con.query(UPDATE_PASS_QUERY, [pass, id], (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            }
            if (result.affectedRows > 0) {
                con.query(SINGLE_GET_QUERY, [id], (err3, result3) => {
                    if(err3) {
                        res.status(409).send(err3.sqlMessage)
                        return
                    }
                    responseData.data = result3[0]
                    res.status(200).send(responseData)
                })  
            }
            
        })



    } catch (error) {
        console.log(error)
    }
}

function loginUser(req, res) {
    try {
        const {
            userId,
            password
        } = req.body;

        con.query(/*sql*/` SELECT id,firstName FROM user WHERE userId = ? AND password = ? `,
            [userId, password], async (err, result) => {
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
router.post('/', insertUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.get('/:id', getSingleUser)
router.post('/login', loginUser)
router.get('/authorized/home', homeUser)
router.get('/login/logout', logoutUser)
router.put('/forgetPass/:id', forgetPass)

module.exports = router;