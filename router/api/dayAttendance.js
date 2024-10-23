const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'attendance'
})

const INSERT_QUERY = /*sql*/`INSERT INTO dayattendance(studentId, wardenId, appearance, date, reason, roomId, blockId) VALUES (?, ?, ?, ?, ?, ?, ?);
`

const SINGLE_GET_QUERY = /*sql*/`SELECT * FROM dayattendance WHERE id = ?`

const DELETE_QUERY = /*sql*/` UPDATE dayattendance SET
                                deletedAt = CURRENT_TIMESTAMP()
                                 WHERE id = ?`

const updatedKey = [
    "studentId",
    "wardenId",
    "appearance",
    "date",
    "reason",
    "roomId",
    "blockId"
]

function getdayattendance(req, res) {
    const queryArr = []
    
    try {     
        const {roomId, blockId} = req.query

        if(roomId) {
            queryArr.push(' roomId = ? ')
        }
        if(blockId){
            queryArr.push(' blockId = ?')
        }

        const queryStr = queryArr.length ? `WHERE ${queryArr.join('AND')}` : ``
        con.query(/*sql*/`SELECT * FROM dayattendance ${queryStr}`,[roomId, blockId], (err, result) => {

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

function insertdayattendance(req, res) {
    try {
        const {
            studentId,
            wardenId,
            appearance,
            date,
            reason,
            roomId,
            blockId
        } = req.body;
        

        const insertColumns = [            
            studentId,
            wardenId,
            appearance,
            date,
            reason,
            roomId,
            blockId
        ]

        con.query(/*sql*/`SELECT date FROM dayattendance WHERE date = ?`,[date], (err1, result1) => {
            if(err1){
                res.status(409).send(err1)
                return
            }
            if(result1.length != 0) {
                res.status(409).send('Already put the attendance for that date')
                return
            }
        con.query(INSERT_QUERY, insertColumns, (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
                return
            }
            if (result.affectedRows != 0) {
                res.status(200).send("INSERTED")
            }
        })

    })

    } catch (error) {
        console.error(error)
    }

}

function updatedayattendance(req, res) {
    try {
        const id = req.params.id;
        const columns = []
        const values = []
        updatedKey.forEach((key) => {
            const keyValue = req.body[key];
            if(keyValue !== undefined) {
                values.push(keyValue)
                columns.push(`${key} = ?`)
            }
        })
        const UPDATE_QUERY = /*sql*/` UPDATE dayattendance SET ${columns} WHERE id = ${id}`
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

function getSingleAttendance(req, res) {
try {
        const {date} = req.query;
        con.query(/*sql*/`SELECT * FROM dayattendance WHERE date = ? `, [date], (err, result) => {
    
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

router.get('/', getdayattendance)
router.post('/', insertdayattendance)
router.put('/:id', updatedayattendance)
router.get('/single', getSingleAttendance)
module.exports = router;