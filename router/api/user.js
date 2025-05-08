const express = require('express');
const router = express.Router();
// const randomstring = require("randomstring");
const otpGenerator = require('otp-generator');
const sendMail = require('../../utils/email');
const execQuery = require('../../utils/query');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const LENGTH_OF_OTP = 6;
const PATTERN_OF_OTP = {
    upperCaseAlphabets: true,
    specialChars: false,
    lowerCaseAlphabets: false
}

// Configure multer storage
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

async function getUser(req, res) {
    const {
        page = 1,
        limit = 5
    } = req.query

    const userResponse = {
        total: 0,
        page: 0,
        limit: 0,
        userData: []
    }

    const condtionArr = []

    try {
        const pageNo = isNaN(Number(page)) ? 1 : Number(page)
        const limitNo = isNaN(Number(limit)) ? 5 : Number(limit)

        const userCount = await execQuery(/*sql*/`SELECT COUNT(id) AS total FROM user WHERE deletedAt IS NULL `)

        if (!userCount.length) {
            return res.status(404).send('not founded')
        }
        userResponse.total = userCount[0].total

        const getUser = await execQuery( /*sql*/ `SELECT *,
            DATE_FORMAT(createdAt, "%D %M %Y")
            AS createdAt 
            FROM user
            WHERE deletedAt IS NULL
            LIMIT ? OFFSET ? `, [limitNo, (pageNo - 1) * limitNo])
        if (getUser.length !== 0) {
            userResponse.page = pageNo;
            userResponse.limit = limitNo
            userResponse.userData = getUser
            res.status(200).send(userResponse)
        } else {
            
            return res.status(404).send('Not Founded')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
async function insertorUpdateUser(req, res) {

    const profileImage = req.file.filename
    const {
        firstName,
        lastName,
        phoneNo,
        email,
        userId,
        password,
        isAdmin
    } = req.body;

    try {
        const userInput = [
            firstName,
            lastName,
            phoneNo,
            email,
            userId,
            password,
            isAdmin,
            profileImage
        ]
        if (firstName.length > 0 && lastName.length > 0 && phoneNo.length > 0 && email.length > 0 && userId.length > 0 && password.length > 0 && isAdmin.length > 0) {
            const postUser = await execQuery(/*sql*/` INSERT INTO 
                user 
                ( firstName, 
                lastName, 
                phoneNo, 
                email, 
                userId, 
                password, 
                isAdmin, otpAttempt,profileImage) 
                VALUES (?,?,?,?,?,?,?,1,?) 
                ON DUPLICATE KEY UPDATE 
                firstName = VALUES(firstName),
                lastName = VALUES(lastName),
                phoneNo = VALUES(phoneNo),
                email = VALUES(email),
                isAdmin = VALUES (isAdmin),
                profileImage = VALUES(profileImage)`,
                userInput)

            if (postUser.affectedRows != 0) {
                res.status(200).send("User Inserted")
            }
        } else {
            return res.status(400).send('Not modified')
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}
async function deleteUser(req, res) {
    const id = req.params.id;
    try {
        const deleteUser = await execQuery(/*sql*/`UPDATE 
            user SET 
            deletedAt = CURRENT_TIMESTAMP 
            WHERE id = ?`, [id])

        if (deleteUser.affectedRows != 0) {
            res.status(200).send('User Deleted')
        } else {
            return res.status(400).send('Not modified')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }

}
async function getSingleUser(req, res) {
    const id = req.params.id;
    try {
        const singleUser = await execQuery(/*sql*/`SELECT 
            * 
            FROM user 
            WHERE id = ?`,
            [id])
        if (singleUser.length) {
            res.status(200).send(singleUser[0])
        } else {
            return res.status(404).send('Not founded')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)

    }
}
async function login(req, res) {
    const { userId, password } = req.body;
    try {
        const userLogin = await execQuery(/*sql*/` SELECT * FROM user WHERE userId = ? AND password = ? `, [userId, password])
        if (userLogin.length > 0) {
            req.session.isLogged = true;
            req.session.data = userLogin[0];
            res.status(200).send('Login Success ')
        }
        else {
            req.session.isLogged = false;
            req.session.data = null;
            res.status(404).send('Invalid user and/or password')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }
}
function home(req, res) {
    try {
        if (req.session.isLogged) {
            const imagePath = req.session.data.profileImage
            const filePath = path.join(__dirname, '../../public/uploads', imagePath)

            const invalidUserProfile = `demoProfile.jpg`
            const invalidUserProfilePath = path.join(__dirname, '../../public/uploads', invalidUserProfile)

            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    return res.status(200).sendFile(invalidUserProfilePath)
                }

                res.status(200).sendFile(filePath, (error) => {
                    if (error) {
                        res.status(500).send(invalidUserProfilePath)
                    }
                })
            })
        }
        else {
            res.status(401).send("Please Login again")
            return
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }
}
function logout(req, res) {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send(err.message)
                return
            }
            res.status(200).send('session destroy')
        });

    } catch (error) {
        return res.status(500).send(error.message)
    }
}
async function processOtp(req, res) {
    //get current time
    const currentTime = new Date().getTime();
    const {
        emailId
    } = req.body
    try {
        // Validate userInputmail length
        if (emailId.length == 0) {
            rs.status(400).send('Invalid email input')
            return
        }

        const userResult = await execQuery(/*sql*/`SELECT 
            email,
            unBlockTime 
            FROM user 
            WHERE email = ? 
            AND deletedAt IS NULL`, [emailId])

        if (!userResult.length) {
            res.status(404).send('Invalid Email ID')
            return
        }
        const unBlockTime = new Date(userResult[0].unBlockTime).getTime();

        if (currentTime >= unBlockTime) {
            const otp = otpGenerator.generate(LENGTH_OF_OTP, PATTERN_OF_OTP);
            const otpUpdateRes = await execQuery(/*sql*/`UPDATE user 
                SET otp = ?,
                    unBlockTime = null, 
                    otpAttempt = 0 
                WHERE email = ? 
                AND deletedAt IS NULL`, [otp, emailId])

            if (otpUpdateRes.affectedRows == 0) {
                res.status(502).send('Not updated in DB')
                return
            }

            const mailOptions = {
                to: emailId,
                subject: 'Send By SH team for rest password ',
                text: `Your new otp is ${otp}`
            }
            await sendMail(mailOptions)
            res.status(200).send('OTP sent ')

        } else {
            return res.status(401).send('user blocked')
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send(error.message)
    }
}
async function restPassword(req, res) {
    try {
        const currentTime = new Date().getTime();
        const otpAttemptMax = 3;
        const { otp, emailId, password } = req.body;

        //check user input 
        if (!emailId || !otp || otp.length < 6) {
            res.status(400).send('Invalid Email or OTP');
            return;
        }
        // get user result
        const userResult = await execQuery(/*sql*/`SELECT 
            otp,
            otpAttempt, 
            unBlockTime 
            FROM user 
            WHERE email = ? AND deletedAt IS NULL`,
            [emailId])

        if (!userResult.length) {
            res.status(404).send('Invalid Email');
            return;
        }
        const userOtp = userResult[0].otp;
        const unBlockTime = new Date(userResult[0].unBlockTime).getTime();
        const currentOtpAttempt = userResult[0].otpAttempt || 0;

        //check user block time is over or not
        if (currentTime < unBlockTime) {
            return res.status(401).send('You are blocked. Try again after the unblock time.');
        }
        // check user atempt gerater than of 3
        if (currentOtpAttempt >= otpAttemptMax) {
            //user block
            const userBlock = await execQuery(`UPDATE 
                user SET 
                unBlockTime = DATE_ADD(NOW(), INTERVAL 3 HOUR)
                WHERE email = ? AND deletedAt IS NULL`,
                [emailId])

            if (userBlock.affectedRows > 0) {
                return res.status(401).send('You are blocked for the next 3 hours.');
            }
        }
        //check user input otp and generate otp not same 
        if (userOtp !== otp) {
            // incerase the attempt
            const attemptIncerement = await execQuery(`UPDATE 
                        user SET 
                        otpAttempt = otpAttempt + 1 
                        WHERE email = ? AND deletedAt IS NULL`,
                [emailId])

            if (attemptIncerement.affectedRows > 0) {
                return res.status(404).send('Invalid OTP');
            }
        }
        // rest the password    
        const updatePassword = await execQuery(`UPDATE 
                    user SET 
                    password = ?, 
                    otp = NULL, 
                    unBlockTime = NULL, 
                    otpAttempt = 0,
                    updatedAt = CURRENT_TIMESTAMP 
                    WHERE email = ? AND deletedAt IS NULL`,
            [password, emailId])

        if (updatePassword.affectedRows > 0) {
            res.status(200).send('Password Updated')
        } else {
            return res.status(400).send('Not Modified')
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

async function getWarden( req, res) {
    
    try {
        const getWarden = await execQuery(/*sql*/`SELECT * FROM user WHERE deletedAt IS NULL`)
        if( getWarden.length == 0){
           return res.status(404).send('Not Founded')
        }
        res.status(200).send(getWarden)
    } catch (error) {
        res.status(500).send(error)
    }
}

router.get('/', getUser)
router.post('/', upload.single('profile'), insertorUpdateUser)
router.delete('/:id', deleteUser)
router.get('/:id', getSingleUser)
router.post('/login', login)
router.get('/user/home', home)
router.get('/user/logout', logout)
router.post('/processotp', processOtp)
router.put('/restpassword', restPassword)
router.get('/admin/getwarden', getWarden)


module.exports = router;
