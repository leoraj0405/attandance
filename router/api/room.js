const express = require('express');
const router = express.Router();
const execQuery = require('../../utils/query')

const UPDATE_KEYS = [
    'roomNo',
    'blockId',
    'isActive'
]
async function getBlockRoom(req, res) {
    try {
        const id = req.params.id;
        const getBlockRoom = await execQuery(/*sql*/`SELECT 
                    *, DATE_FORMAT(createdAt, "%D %M %Y") 
                    AS createdAt
                    FROM room 
                    WHERE blockId = ? AND deletedAt IS NULL`, [id])

        if (getBlockRoom.length !== 0) {
            res.status(200).send(getBlockRoom)
        } else {
            return res.status(404).send(getBlockRoom)
        }
    } catch (error) {
        return res.status(500).send(error.messege)
    }

}
async function getRoom(req, res) {
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

        const count = await execQuery(/*sql*/`SELECT COUNT(id) AS total FROM room WHERE deletedAt IS NULL `)
        response.total = count[0].total

        const getAllRoom = await execQuery(/*sql*/`SELECT 
            r.*, 
            DATE_FORMAT('2025-07-07', "%D %M %Y") AS createdAt , 
            b.name as blockName  
            FROM room as r
             JOIN blocks AS b ON b.id = r.blockId 
             WHERE r.deletedAt IS NULL LIMIT ? OFFSET ? `, [limitNo, (pageNo - 1) * limitNo])
        if (getAllRoom.length > 0) {
            response.data = getAllRoom
            response.limit = limitNo
            response.page = pageNo
            res.status(200).send(response)
        } else {
            return res.status(404).send('Not Founded')
        }
    } catch (error) {
        return res.status(500).send(error.messege)
    }

}
async function insertRoom(req, res) {
    try {
        const {
            roomNo,
            blockId,
            isActive,
        } = req.body;

        const postOrPutroom = await execQuery( /*sql*/`INSERT INTO room 
                                (roomNo, blockId, isActive, roomCount)
                                VALUES (?, ?, ?, 
                                (SELECT COUNT(*) FROM 
                                (SELECT roomNo FROM room WHERE deletedAt IS NULL )
                                 AS temp)
                                 )`,
            [roomNo, blockId, isActive])
        if (postOrPutroom.affectedRows !== 0) {
            res.status(200).send("Data Inserted")
        } else {
            return res.status(400).send('Not modified')
        }
    } catch (error) {
        return res.status(500).send(error.messege)
    }

}
async function updateRoom(req, res) {
    const id = req.params.id;
    const columns = []
    const values = []
    try {
        UPDATE_KEYS.forEach((key) => {
            const keyValue = req.body[key];
            if (keyValue !== undefined) {
                values.push(keyValue)
                columns.push(`${key} = ?`)
            }
        })
        const updateRoom = await execQuery(/*sql*/` UPDATE room SET ${columns}, 
                                        updatedAt = current_timestamp()
                                         WHERE id = ${id} AND deletedAt IS NULL`, values)

        if (updateRoom.affectedRows != 0) {
            const getUpdatedRoom = await execQuery( /*sql*/`SELECT * FROM room WHERE id = ?`, [id])
            if (getUpdatedRoom.length !== 0) {
                res.status(200).send(getUpdatedRoom[0])
            }
        } else {
            return res.status(400).send('Not Modified')
        }

    } catch (error) {
        return res.status(500).send(error.messege)
    }

}
async function deleteRoom(req, res) {
    const id = req.params.id;
    try {
        const deleRoom = await execQuery(/*sql*/`UPDATE room SET
            deletedAt = CURRENT_TIMESTAMP()
             WHERE id = ?`, [id])
        if (deleRoom.affectedRows > 0) {
            res.status(200).send("DELETED")
        } else {
            return res.status(400).send('Not Modified')
        }
    } catch (error) {
        return res.status(500).send(error.messege)
    }
}
async function getSingleRoom(req, res) {
    const id = req.params.id;
    try {
        const getSingleRoom = await execQuery(/*sql*/`SELECT * FROM room WHERE id = ?`, [id])
        if (getSingleRoom.length !== 0) {
            res.status(200).send(getSingleRoom[0])
        } else {
            return res.status(404).send('Not Founded')
        }
    } catch (error) {
        return res.status(500).send(error.messege)
    }
}

router.get('/', getRoom)
router.get('/block/:id', getBlockRoom)
router.post('/', insertRoom)
router.put('/:id', updateRoom)
router.delete('/:id', deleteRoom)
router.get('/:id', getSingleRoom)

module.exports = router;