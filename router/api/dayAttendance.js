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


async function report(req, res) {
    const id = req.params.id;
    const totalDays =req.params.days

    try {
        if (!totalDays || totalDays <= 0) {
            return res.status(400).send("Invalid total days.");
        }

        const data = await execQuery(/*sql*/`SELECT 
        d.*, s.sfirstName, r.roomNo, b.name  FROM dayattendance AS d 
        JOIN student AS s ON s.id = d.studentId
        JOIN room AS r ON r.id = d.roomId
        JOIN blocks AS b ON b.id = d.blockId 
        WHERE s.wardenId = ? ORDER BY date DESC`, [id])

        if (data.length !== 0) {

            const studentMap = {};

            for (const row of data) {
                const id = row.studentId;

                if (!studentMap[id]) {
                    studentMap[id] = {
                        studentId: id,
                        name: row.sfirstName,
                        presentDays: 0
                    };
                }

                if (row.appearance === 'p') {
                    studentMap[id].presentDays += 1;
                }
            }

            const report = Object.values(studentMap).map(student => ({
                ...student,
                totalDays,
                percentage: Math.round((student.presentDays / totalDays) * 100)
            }));
            res.status(200).send(report)
        }
        else {
            return res.status(404).send('Not Founded')
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
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
                                WHERE date = ? AND roomId = ? AND blockId = ?`, [date, roomId, blockId])
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
router.get('/report/:id/:days', report)

module.exports = router;