const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'attendance'
})

const GET_QUERY = /*sql*/`SELECT *, 
                    DATE_FORMAT(createdAt, "%D %M %Y") 
                    AS
                    createdAt FROM student WHERE deletedAt IS NULL`

const GET_ROOM_WISE_QUERY = /*sql*/`SELECT *, 
                    DATE_FORMAT(createdAt, "%D %M %Y") 
                    AS
                    createdAt FROM student WHERE deletedAt IS NULL AND roomId = ?`


const INSERT_QUERY = /*sql*/`INSERT INTO student (
                    accNo, 
                    firstName, 
                    lastName, 
                    wardenId,
                    blockId, roomId, departmentId, phoneNo, email, native) 
                    VALUES (?,?,?,?,?,?,?,?,?,?)`

const SINGLE_GET_QUERY = /*sql*/`SELECT * FROM student WHERE id = ?`

const DELETE_QUERY = /*sql*/` UPDATE student SET
                                deletedAt = CURRENT_TIMESTAMP()
                                 WHERE id = ?`

const updatedKeys = [
    "accNo",
    "firstName",
    "lastName",
    "wardenId",
    "blockId",
    "roomId",
    "departmentId",
    "phoneNo",
    "email",
    "native"
]

function getStudent(req, res) {
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

function getRoomStudent(req, res) {
    try {
        const id = req.params.id;
        con.query(GET_ROOM_WISE_QUERY,[id], (err, result) => {
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

function insertStudent(req, res) {
    try {
        const {
            accNo,
            firstName,
            lastName,
            wardenId,
            blockId,
            roomId,
            departmentId,
            phoneNo,
            email,
            native,
        } = req.body;

        const studentInput = [
            accNo,
            firstName,
            lastName,
            wardenId,
            blockId,
            roomId,
            departmentId,
            phoneNo,
            email,
            native
        ]
        con.query(INSERT_QUERY, studentInput, (err, result) => {
            if (err) {
                // console.log(err)
                res.status(409).send(err.sqlMessage)
                return
            }
            if (result.affectedRows != 0) {
                res.status(200).send("INSERTED")
            }
        })

    } catch (error) {
        console.error(error)
    }

}

function updateStudent(req, res) {
    try {
        const id = req.params.id;
        const columnName = []
        const values = []
        updatedKeys.forEach((key) => {
            keyValue = req.body[key]
            if (keyValue !== undefined) {
                values.push(keyValue)
                columnName.push(` ${key} = ?`)
            }
        })
        // account cant be editable
        const UPDATE_QUERY = /*sql*/` UPDATE student SET ${columnName}, 
                                        updatedAt = CURRENT_TIMESTAMP() 
                                        WHERE id = ${id} `
        con.query(UPDATE_QUERY, values, (err, result) => {
            if (err) {
                console.log(err)
                res.status(409).send(err.sqlMessage)
                return
            }
            if (result.affectedRows != 0) {
                con.query(SINGLE_GET_QUERY, [id],
                    (err2, result2) => {
                        if (err2) {
                            console.log(err2)
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

function deleteStudent(req, res) {
    try {
        const id = req.params.id;
        con.query(DELETE_QUERY, [id], (err, result) => {
            if (err) {
                console.log(err)
                res.status(409).send(err.sqlMessage)
                return
            }

            if (result.affectedRows > 0) {
                res.status(200).send("DELETED")
            }
            else {
                res.status(409).send(err.sqlMessage)
                return
            }
        })
    } catch (error) {
        console.error(error)
    }

}

function getSingleStudent(req, res) {
    try {
        const id = req.params.id;
        con.query(SINGLE_GET_QUERY, [id], (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            } else {
                res.status(200).send(result[0])
            }
        })
    } catch (error) {
        console.log(error)
    }
}

router.get('/', getStudent)
router.get('/room/:id',getRoomStudent)
router.post('/', insertStudent)
router.put('/:id', updateStudent)
router.delete('/:id', deleteStudent)
router.get('/:id', getSingleStudent)

module.exports = router;