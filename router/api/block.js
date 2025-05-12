const express = require('express');
const router = express.Router();
const execQuery = require('../../utils/query');

const SINGLE_GET_QUERY = /*sql*/`SELECT * FROM blocks WHERE id = ?`

const DELETE_QUERY = /*sql*/` UPDATE blocks SET
                                deletedAt = CURRENT_TIMESTAMP()
                                 WHERE id = ?`

async function getBlock(req, res) {
    const {
        page = 1,
        limit = 5
    } = req.query

    const response = {
        total: 0,
        page: 0,
        limit: 0,
        data: []
    }
    try {

        const pageNo = isNaN(Number(page)) ? 1 : Number(page)
        const limitNo = isNaN(Number(limit)) ? 5 : Number(limit)

        const blockCount = await execQuery(/*sql*/`SELECT COUNT(id) AS total FROM blocks WHERE deletedAt IS NULL `)
        response.total = blockCount[0].total
        const getBlock = await execQuery(/*sql*/`SELECT 
                *, DATE_FORMAT(createdAt, "%D %M %Y") 
                AS createdAt 
                FROM blocks 
                WHERE deletedAt IS NULL LIMIT ? OFFSET ? `, [limitNo, (pageNo - 1) * limitNo])
        if (getBlock.length !== 0) {
            response.data = getBlock
            response.limit = limitNo
            response.page = pageNo
            res.status(200).send(response)
        } else {
            return res.status(404).send(response)
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }

}

async function insertBlock(req, res) {
    const {
        name
    } = req.body;
    try {
        const insertBlock = await execQuery( /*sql*/`INSERT 
                INTO blocks (name)
                VALUES (?) `, [name])
        if (insertBlock.affectedRows !== 0) {
            res.status(200).send("INSERTED")
        } else {
            return res.status(400).send('Not Modified')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }

}

async function updateBlock(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const updateBlock = await execQuery( /*sql*/` 
                    UPDATE blocks 
                    SET name = ?, 
                    updatedAt = current_timestamp()
                    WHERE id = ?`, [name, id])

        if (updateBlock.affectedRows !== 0) {
            const getUpdatedBlock = await execQuery(SINGLE_GET_QUERY, [id])
            if (getUpdatedBlock.length !== 0) {
                res.status(200).send(getUpdatedBlock[0])
            } else {
                return res.status(404).send('Not Founded')
            }
        } else {
            return res.status(400).send('Not Modifed')
        }

    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }

}

async function deleteBlock(req, res) {
    const id = req.params.id;
    try {
        const deleteBlock = await execQuery(DELETE_QUERY, [id])
        if (deleteBlock.affectedRows !== 0) {
            res.status(200).send("DELETED")
        }
        else {
            res.status(400).send('Not modified')
            return
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }

}

async function getSingleBlock(req, res) {
    const id = req.params.id;
    try {
        const getSingleBlock = await execQuery(SINGLE_GET_QUERY, [id])

        if (getSingleBlock.length !== 0) {
            res.status(200).send(getSingleBlock[0])
        } else {
            return res.status(404).send('Not Founded')
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

router.get('/', getBlock)
router.post('/', insertBlock)
router.put('/:id', updateBlock)
router.delete('/:id', deleteBlock)
router.get('/:id', getSingleBlock)

module.exports = router;