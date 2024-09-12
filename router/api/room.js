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
                    createdAt FROM room WHERE deletedAt IS NULL`

const INSERT_QUERY = /*sql*/`INSERT INTO room (roomNo, blockId) VALUES (?,?)`

const SINGLE_GET_QUERY = /*sql*/`SELECT * FROM room WHERE id = ?`

const DELETE_QUERY = /*sql*/` UPDATE room SET
                                deletedAt = CURRENT_TIMESTAMP()
                                 WHERE id = ?`

const updatedKey = [
    "roomNo",
    "blockId",
]

function getRoom(req, res) {
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

function insertRoom(req, res) {
    try {
        const {
            roomNo,
            blockId,
        } = req.body;

        con.query(INSERT_QUERY, [roomNo, blockId], (err, result) => {
            console.log(INSERT_QUERY)
            if (err) {
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

function updateRoom(req, res) {
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
        const UPDATE_QUERY = /*sql*/` UPDATE room SET ${columns}, 
                                        updatedAt = current_timestamp()
                                         WHERE id = ${id}`
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
function deleteRoom(req, res) {
    try {
        const id = req.params.id;
        con.query(DELETE_QUERY, [id], (err, result) => {
            if (err) {
                // console.log(err)
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

function getSingleRoom(req, res) {
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

router.get('/', getRoom)
router.post('/', insertRoom)
router.put('/:id', updateRoom)
router.delete('/:id', deleteRoom)
router.get('/:id', getSingleRoom)

module.exports = router;