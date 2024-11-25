const express = require('express');
const router = express.Router();
const execQuery = require('../../utils/query');
const { get } = require('http');

async function getStudent(req, res) {
    try {
        const {
            limit = 5,
            page = 1,
        } = req.query

        const pageNo = isNaN(Number(page)) ? 1 : Number(page)
        const limitNo = isNaN(Number(limit)) ? 5 : Number(limit)

        const studentCount = await execQuery(/*sql*/`SELECT COUNT(id) AS total FROM student WHERE deletedAt IS NULL `)

        if (studentCount.length !== 0) {
            responseData.total = studentCount[0].total
        } else {
            return res.status(404).send('Not founded')
        }
        const getStudent = await execQuery( /*sql*/`SELECT 
                                s.*,
                                d.deptName,
                                b.name,
                                u.firstName 
                                FROM student AS s 
                                JOIN 
                                department AS d 
                                ON d.id = s.departmentId 
                                JOIN 
                                blocks AS b 
                                ON b.id = s.blockId 
                                JOIN 
                                user AS u 
                                ON u.id = s.wardenId 
                                WHERE s.deletedAt IS NULL LIMIT ? OFFSET ?`, [limitNo, (pageNo - 1) * limitNo])


        if (getStudent.length !== 0) {
            responseData.limit = limitNo;
            responseData.page = pageNo;
            responseData.studentInfo = getStudent
            res.status(200).send(responseData)
        } else {
            return res.status(404).send(' Not Founded ')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
async function getRoomStudent(req, res) {
    const {
        room,
        block, } = req.query;

        const responseData = {
            room: 0,
            block: 0,
            data: []
        }
    try {
        const getStudRoomWise = await execQuery(/*sql*/`SELECT *, 
                            DATE_FORMAT(createdAt, "%D %M %Y") 
                            AS
                            createdAt FROM student
                            WHERE deletedAt IS NULL AND roomId = ? AND blockId = ?`, [room, block])
         if (getStudRoomWise.length !== 0) {
            res.status(200).send(getStudRoomWise)
        } else {
            return res.status(404).send('Invalid Room')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)

    }

}
async function insertorUpdateStudent(req, res) {
    const {
        accNo, firstName, lastName, wardenId, blockId, roomId, departmentId, phoneNo, email, native,
    } = req.body;
    try {
        const studentInput = [
            accNo, firstName, lastName, wardenId, blockId, roomId, departmentId, phoneNo, email, native
        ]
        const insertOrUpdateStud = await execQuery( /*sql*/`INSERT INTO student 
                        (accNo, firstName, lastName, wardenId, blockId, roomId, departmentId, phoneNo, email, native) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                        ON DUPLICATE KEY UPDATE
                        firstName = VALUES(firstName),
                        lastName = VALUES(lastName),
                        phoneNo = VALUES(phoneNo),
                        email = VALUES(email),
                        blockId = VALUES(blockId),
                        roomId = VALUES(roomId),
                        departmentId = VALUES(departmentId),
                        wardenId = VALUES(wardenId)
                        native = VALUES(native)`, studentInput)

        if (insertOrUpdateStud.affectedRows !== 0) {
            res.status(200).send("Student Inserted")
        } else {
            return res.status(400).send('NotModified')
        }

    } catch (error) {
        return res.status(500).send(error.message)
    }

}
async function deleteStudent(req, res) {
    const id = req.params.id;
    try {
        const deleStudent = await execQuery(/*sql*/` UPDATE 
            student SET
            deletedAt = CURRENT_TIMESTAMP()
             WHERE id = ?`, [id])

        if (deleStudent.affectedRows !== 0) {
            res.status(200).send("Deleted")
        } else {
            return res.status(400).send('Not Modified')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }

}
async function getSingleStudent(req, res) {
    const id = req.params.id;
    try {
        const singleStud = await execQuery(/*sql*/`SELECT * FROM  student WHERE id = ? AND deletedAt IS NULL`, [id])
        if (singleStud.length) {
            res.status(200).send(singleStud[0])
        } else {
            return res.status(404).send('Not founed')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

router.get('/', getStudent)
router.get('/room', getRoomStudent)
router.post('/', insertorUpdateStudent)
router.delete('/:id', deleteStudent)
router.get('/:id', getSingleStudent)

module.exports = router;