const express = require('express');
const router = express.Router();
// const randomstring = require("randomstring");
const otpGenerator = require('otp-generator');
const sendMail = require('../../utils/email');
const execQuery = require('../../utils/query');

const LENGTH_OF_OTP = 6;
const PATTERN_OF_OTP = {
    upperCaseAlphabets: true,
    specialChars: false,
    lowerCaseAlphabets: false
}

async function getUser(req, res) {
    try {
        const getUser = await execQuery( /*sql*/ `SELECT *,
            DATE_FORMAT(createdAt, "%D %M %Y")
            AS createdAt 
            FROM user
            WHERE deletedAt IS NULL`)

        if (getUser.length !== 0) {
            res.status(200).send(getUser)
        }else {
            return res.status(404).send('Not Founded')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
async function insertorUpdateUser(req, res) {
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
            isAdmin
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
                isAdmin, otpAttempt) 
                VALUES (?,?,?,?,?,?,?,1) 
                ON DUPLICATE KEY UPDATE 
                firstName = VALUES(firstName),
                lastName = VALUES(lastName),
                phoneNo = VALUES(phoneNo),
                email = VALUES(email),
                password = VALUES(password),
                isAdmin = VALUES (isAdmin)`, userInput)

            if (postUser.affectedRows != 0) {
                res.status(200).send("User Inserted")
            }
        } else {
            return res.status(304).send('Not modified')
        }
    } catch (error) {
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
        }else {
            return res.status(304).send('Not modified')
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
            if(singleUser.length) {
                res.status(200).send(singleUser[0])
            }else {
                return res.status(404).send('Not founded')
            }
    } catch (error) {
        console.error(error)
       return res.status(500).send(error.message)

    }
}
// function restPassword(req, res) {
//     try {
//         const {
//             email,
//         } = req.body;

//         const randomString = randomstring.generate({
//             length: 6
//         });
//         console.log(randomString)

//         con.query(/*sql*/`SELECT email FROM user WHERE email = ?`, [email], (err1, result1) => {
//             if (result1 == 0) {
//                 res.status(409).send('Invalid Email Id')
//                 return
//             }
//             con.query(/*sql*/`UPDATE user SET password = ? WHERE email = ?`,
//                 [randomString, email],
//                 async (err, result) => {
//                     if (err) {
//                         res.status(409).send(err.sqlMessage)
//                         return
//                     }
//                     console.log(result)
//                     if (result.affectedRows == 0) {
//                         console.log(result)
//                         res.status(409).send('API Error : Reset Password Unsccessfull')
//                         return
//                     }
//                     const mailOptions = {
//                         to: email,
//                         subject: 'Send By SH Team',
//                         text: `Your new password is ${randomString}`
//                     }

//                     try {
//                         const emailResult = await sendMail(mailOptions)
//                     } catch (error) {
//                         console.log(error)
//                     }
//                 })


//         })

//     } catch (error) {
//         console.log(error)
//     }
// }
async function login(req, res) {
    const { userId, password } = req.body;
    try {
        const userLogin = await execQuery(/*sql*/` SELECT id,firstName,isAdmin FROM user WHERE userId = ? AND password = ? `, [userId, password]) 
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
            const userData = req.session.data
            res.status(200).send("Welcome " + userData.firstName)
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
        console.log(unBlockTime+ ' '+ currentTime)
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
        }else {
            return res.status(304).send('Not Modified')
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

router.get('/', getUser)
router.post('/', insertorUpdateUser)
router.delete('/:id', deleteUser)
router.get('/:id', getSingleUser)
router.post('/login', login)
router.get('/user/home', home)
router.get('/user/logout', logout)
// router.put('/restPassword', restPassword)  method 1
router.post('/processotp', processOtp)
router.put('/restpassword', restPassword)


module.exports = router;
