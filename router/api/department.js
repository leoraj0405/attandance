const express = require('express');
const router = express.Router();
const execQuery = require('../../utils/query');

const SINGLE_GET_QUERY = /*sql*/`SELECT * FROM department WHERE id = ?`

const DELETE_QUERY = /*sql*/` UPDATE department SET
                                deletedAt = CURRENT_TIMESTAMP()
                                 WHERE id = ?`

async function getDepartment(req, res) {
    try {
        const getDepartment = await execQuery(/*sql*/`SELECT 
                *, DATE_FORMAT(createdAt, "%D %M %Y") 
                AS createdAt 
                FROM department 
                WHERE deletedAt IS NULL`)
        if (getDepartment.length !== 0) {
            res.status(200).send(getDepartment)
        } else {
            return res.status(404).send('Not Founded')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }

}

async function insertDepartment(req, res) {
    const {
        name
    } = req.body;
    try {
        const insertDepartment = await execQuery( /*sql*/`INSERT 
                INTO department (name)
                VALUES (?) `, [name])
        if (insertDepartment.affectedRows !== 0) {
            res.status(200).send("INSERTED")
        } else {
            return res.status(304).send('Not Modified')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }

}
async function updateDepartment(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const updateDepartment = await execQuery( /*sql*/` 
                    UPDATE department 
                    SET name = ?, 
                    updatedAt = current_timestamp()
                    WHERE id = ?`, [name, id])

        if (updateDepartment.affectedRows !== 0) {
            const getUpdatedBlock = await execQuery(SINGLE_GET_QUERY, [id])
            if (getUpdatedBlock.length !== 0) {
                res.status(200).send(getUpdatedBlock[0])
            } else {
                return res.status(404).send('Not Founded')
            }
        } else {
            return res.status(304).send('Not Modifed')
        }

    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }

}
async function deleteDepartment(req, res) {
    const id = req.params.id;
    try {
        const deleteDepartment = await execQuery(DELETE_QUERY, [id])
        if (deleteDepartment.affectedRows !== 0) {
            res.status(200).send("DELETED")
        }
        else {
            res.status(304).send('Not modified')
            return
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }

}
async function getSingleDepartment(req, res) {
    const id = req.params.id;
    try {
        const getSingleDepartment = await execQuery(SINGLE_GET_QUERY, [id])

        if (getSingleDepartment.length !== 0) {
            res.status(200).send(getSingleDepartment[0])
        } else {
            return res.status(404).send('Not Founded')
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}
router.get('/', getDepartment)
router.post('/', insertDepartment)
router.put('/:id', updateDepartment)
router.delete('/:id', deleteDepartment)
router.get('/:id', getSingleDepartment)

module.exports = router;