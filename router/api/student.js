const express = require('express');
const router = express.Router();
const execQuery = require('../../utils/query');

async function getStudent(req, res) {
    try {
        const getStudent = await execQuery( /*sql*/`SELECT *, 
                    DATE_FORMAT(createdAt, "%D %M %Y") 
                    AS
                    createdAt FROM student WHERE deletedAt IS NULL`)
        if (getStudent.length !== 0) {
            res.status(200).send(getStudent)
        } else {
            return res.status(404).send('Not founded')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
async function getRoomStudent(req, res) {
    const id = req.params.id;
    try {
        const getStudRoomWise = await execQuery(/*sql*/`SELECT *, 
                            DATE_FORMAT(createdAt, "%D %M %Y") 
                            AS
                            createdAt FROM student
                            WHERE deletedAt IS NULL AND roomId = ?`, [id])
        console.log(getStudRoomWise)
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
            return res.status(304).send('NotModified')
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
            return res.status(304).send('Not Modified')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }

}
async function getSingleStudent(req, res) {
    const id = req.params.id;
    try {
        const singleStud = await execQuery(/*sql*/`SELECT * FROM  student WHERE id = ? AND deletedAt IS NULL`, [id])
        console.log(singleStud)
        if (singleStud.length) {
            res.status(200).send(singleStud[0])
        }else {
            return res.status(404).send('Not founed')
        }
    } catch (error) {
       return res.status(500).send(error.message)
    }
}

router.get('/', getStudent)
router.get('/room/:id', getRoomStudent)
router.post('/', insertorUpdateStudent)
router.delete('/:id', deleteStudent)
router.get('/:id', getSingleStudent)

module.exports = router;