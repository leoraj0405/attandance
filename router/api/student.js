const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const execQuery = require('../../utils/query');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // save files in the uploads folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

async function getStudent(req, res) {

    const responseData = {
        total: 0,
        limit: 0,
        page: 0,
        wardenId: 0,
        studentInfo: []
    }
    try {
        const {
            limit = 5,
            page = 1,
            warden,
        } = req.query

        const pageNo = isNaN(Number(page)) ? 1 : Number(page)
        const limitNo = isNaN(Number(limit)) ? 5 : Number(limit)

        const studentCount = await execQuery(/*sql*/`SELECT COUNT(id) AS total FROM student
                                                        WHERE deletedAt IS NULL AND wardenId = ? `, [warden])
        if (studentCount.length !== 0) {
            responseData.total = studentCount[0].total
        } else {
            return res.status(404).send('Not founded')
        }
        const getStudent = await execQuery( /*sql*/`SELECT 
                                s.*, d.deptName, b.name, u.firstName, r.roomNo 
                                FROM student AS s 
                                JOIN department AS d ON d.id = s.departmentId 
                                JOIN blocks AS b ON b.id = s.blockId 
                                JOIN user AS u ON u.id = s.wardenId 
                                JOIN room AS r ON r.id = s.roomId
                                WHERE s.deletedAt IS NULL AND s.wardenId = ? LIMIT ? OFFSET ? `, [warden, limitNo, (pageNo - 1) * limitNo])

        if (getStudent.length !== 0) {
            responseData.limit = limitNo;
            responseData.page = pageNo;
            responseData.wardenId = warden;
            responseData.studentInfo = getStudent
            res.status(200).send(responseData)
        } else {
            return res.status(200).send(responseData)
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
async function getRoomStudent(req, res) {
    const {
        room,
        block, } = req.query;

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
        accNo,
        firstName,
        lastName,
        wardenId,
        blockId,
        roomId,
        departmentId,
        phoneNo,
        email,
        native,
    } = req.body;

    const studFile = req.file.filename
    try {
        const studentInput = [
            accNo,
            firstName,
            lastName,
            wardenId,
            blockId,
            roomId,
            departmentId,
            phoneNo,
            email,
            native,
            studFile
        ]
        const insertOrUpdateStud = await execQuery( /*sql*/`INSERT INTO student 
        (accNo, sfirstName, lastName, wardenId, blockId, roomId, departmentId, phoneNo, email, native, studProfile) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            sfirstName = VALUES(sfirstName),
                            lastName = VALUES(lastName),
                            phoneNo = VALUES(phoneNo),
                            email = VALUES(email),
                            blockId = VALUES(blockId),roomId = VALUES(roomId),
                            departmentId = VALUES(departmentId),
                            wardenId = VALUES(wardenId),
                            native = VALUES(native),
                            studProfile = VALUES(studProfile)`, studentInput)

        if (insertOrUpdateStud.affectedRows !== 0) {
            res.status(200).send("Student Inserted")
        } else {
            return res.status(400).send('NotModified')
        }

    } catch (error) {
        return res.status(500).send(error)
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
        const singleStud = await execQuery(/*sql*/`SELECT 
                                s.*, d.deptName, b.name, u.firstName, r.roomNo 
                                FROM student AS s 
                                JOIN department AS d ON d.id = s.departmentId 
                                JOIN blocks AS b ON b.id = s.blockId 
                                JOIN user AS u ON u.id = s.wardenId 
                                JOIN room AS r ON r.id = s.roomId
                                WHERE s.deletedAt IS NULL AND s.id = ?`, [id])
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
router.post('/', upload.single('studProfile'), insertorUpdateStudent)
router.delete('/:id', deleteStudent)
router.get('/:id', getSingleStudent)

module.exports = router;