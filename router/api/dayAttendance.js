const express = require('express');
const router = express.Router();
const execQuery = require('../../utils/query');

async function getdayattendance(req, res) {
    const id = req.params.id;
    try {
        const getStudAttendance = await execQuery(/*sql*/`SELECT 
                        *
                        FROM dayattendance 
                        WHERE studentId = ?`,
            [id])
        if (getStudAttendance.length !== 0) {
            res.status(200).send(getStudAttendance)
        }
        else {
            return res.status(404).send('Not Founded')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.messege)
    }

}
async function postOrPutAttendance(req, res) {
    const {
        studentId,
        wardenId,
        appearance,
        date,
        reason,
        roomId,
        blockId
    } = req.body;
    try {
        const insertColumns = [
            studentId,
            wardenId,
            appearance,
            date,
            reason,
            roomId,
            blockId
        ]
        const checkTodayAtt = await execQuery(/*sql*/`SELECT 
                                * FROM
                                dayattendance 
                                WHERE date = ? AND roomId = ? AND blockId = ?`,[date, roomId, blockId])
        console.log(checkTodayAtt)
        const postAttendance = await execQuery(/*sql*/`INSERT 
                                INTO dayattendance 
                                (studentId, 
                                wardenId, 
                                appearance, 
                                date, 
                                reason, 
                                roomId, 
                                blockId)
                                VALUES (?, ?, ?, ?, ?, ?, ?)
                                ON DUPLICATE KEY UPDATE
                                appearance = VALUES(appearance), 
                                reason = VALUES(reason)`, insertColumns)
        console.log(postAttendance)
        if (postAttendance.affectedRows !== 0) {
            res.status(200).send("INSERTED")

        } else {
            res.status(400).send('Not Modified')
            return
        }

    } catch (error) {
        console.error(error)
        return res.status(500).send(error.messege)
    }

}
router.get('/:id', getdayattendance)
router.post('/', postOrPutAttendance)

module.exports = router;