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
                    createdAt FROM blocks WHERE deletedAt IS NULL`

const INSERT_QUERY = /*sql*/`INSERT INTO blocks (name) VALUES (?)`

const SINGLE_GET_QUERY = /*sql*/`SELECT * FROM blocks WHERE id = ?`

const DELETE_QUERY = /*sql*/` UPDATE blocks SET
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

function getBlock(req, res) {
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

function insertBlock(req, res) {
    try {
        const {
            name
        } = req.body;

        con.query(INSERT_QUERY,[name], (err, result) => {
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

function updateBlock(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const UPDATE_QUERY = /*sql*/` UPDATE blocks SET name = ?, 
                                        updatedAt = current_timestamp()
                                         WHERE id = ${id}`
        con.query(UPDATE_QUERY,[name], (err, result) => {
            console.log(UPDATE_QUERY)
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

function deleteBlock(req, res) {
    try {
        const id = req.params.id;
        con.query(DELETE_QUERY,[id], (err, result) => {
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

function getSingleBlock(req,res)  {
    try {
     const id = req.params.id;
     con.query(SINGLE_GET_QUERY,[id], (err, result) => {
         if (err) {
             res.status(409).send(err.sqlMessage)
             return
         }else {
             res.status(200).send(result[0])
         }
     })
    } catch (error) {
         console.log(error)
    }
}

router.get('/',getBlock)
router.post('/',insertBlock)
router.put('/:id',updateBlock)
router.delete('/:id', deleteBlock)
router.get('/:id', getSingleBlock)

module.exports = router;