const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


router.get('/asstdir', async (req, res) => {
        const {
                page: pageInput,
        } = req.query
        try {
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage
                        const fetchUrl = new URL(`${process.env.MAIN_URL}/api/user`)
                        pageInput && fetchUrl.searchParams.append('page', pageInput);
                        const userResponse = await fetch(fetchUrl.href)
                        const userData = await userResponse.json()
                        const currentPage = userData.page
                        const pagesTotal = Math.ceil(userData.total / userData.limit)
                        const mainUrl = process.env.MAIN_URL
                        res.render('pages/users/userList.ejs', { ...userData, profile, user, admin, currentPage, pagesTotal, mainUrl })
                } else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
                }
        } catch (error) {
                console.error(error)
        }
})

router.get('/addad', (req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const pageName = 'Add'
                        const mainUrl = process.env.MAIN_URL
                        res.render('pages/users/userAdd.ejs', { pageName, profile: '', data: {}, user, admin, inputType: {}, mainUrl })
                } else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
                }

        } catch (error) {
                console.error(error)
        }
})

router.get('/editad/:id', async (req, res) => {
        try {
                const id = req.params.id;
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage
                        const pageName = 'Edit'
                        const response = await fetch(`${process.env.MAIN_URL}/api/user/${id}`)
                        const data = await response.json()
                        const inputType = 'disabled'
                        const mainUrl = process.env.MAIN_URL
                        res.render('pages/users/userAdd.ejs', { pageName, profile, data, inputType, user, admin, mainUrl })
                } else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
                }

        } catch (error) {
                console.error(error)
        }
})

router.get('/student', async (req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const {
                                page: pageInput,
                        } = req.query
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage;
                        const currentWarden = req.session.data.id
                        const fetchUrl = new URL(`${process.env.MAIN_URL}/api/student`)
                        pageInput && fetchUrl.searchParams.append('page', pageInput);
                        currentWarden && fetchUrl.searchParams.append('warden', currentWarden);

                        const response = await fetch(fetchUrl.href)
                        const studentInfo = await response.json()
                        const studentList = 'No students'
                        const currentPage = studentInfo.page
                        var pagesTotal = Math.ceil(studentInfo.total / studentInfo.limit)
                        const mainUrl = process.env.MAIN_URL
                        res.render('pages/student/studentList.ejs', { user, profile, admin, ...studentInfo, pagesTotal, currentPage, studentList, mainUrl })
                } else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
                }
        } catch (error) {
                console.error(error)
        }
})

router.get('/addstudent', async (req, res) => {
        try {

                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage;
                        const studentProfile = ''
                        const pageName = 'Add'
                        const inputType = 'disabled'

                        const wardenResponse = await fetch(`${process.env.MAIN_URL}/api/user/admin/getwarden`)
                        const wardenList = await wardenResponse.json()

                        const blockRes = await fetch(`${process.env.MAIN_URL}/api/block`)
                        const blockList = await blockRes.json()

                        const deptRes = await fetch(`${process.env.MAIN_URL}/api/department`)
                        const deptList = await deptRes.json()
                        const mainUrl = process.env.MAIN_URL

                        res.render('pages/student/addStudent.ejs', {
                                pageName,
                                studentProfile,
                                data: {},
                                inputType,
                                user,
                                admin,
                                wardenList,
                                blockList,
                                deptList,
                                mainUrl
                        })
                } else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
                }

        } catch (error) {
                console.error(error)
        }
})

router.get('/editstudent/:id', async (req, res) => {
        try {
                const id = req.params.id

                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage;
                        const studentProfile = ''
                        const pageName = 'Edit'

                        const wardenResponse = await fetch(`${process.env.MAIN_URL}/api/user/admin/getwarden`)
                        const wardenList = await wardenResponse.json();

                        const blockRes = await fetch(`${process.env.MAIN_URL}/api/block`)
                        const blockList = await blockRes.json();

                        const deptRes = await fetch(`${process.env.MAIN_URL}/api/department`)
                        const deptList = await deptRes.json();

                        const response = await fetch(`${process.env.MAIN_URL}/api/student/${id}`)
                        const data = await response.json()
                        const mainUrl = process.env.MAIN_URL

                        res.render('pages/student/addStudent.ejs', {
                                pageName,
                                studentProfile,
                                data,
                                user,
                                admin,
                                wardenList,
                                blockList,
                                deptList,
                                mainUrl
                        })
                } else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
                }

        } catch (error) {
                console.error(error)
        }
})

router.get('/blocklist', async (req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage;
                        const blockResponse = await fetch(`${process.env.MAIN_URL}/api/block`)
                        const blockData = await blockResponse.json()
                        const mainUrl = process.env.MAIN_URL
                        res.render('pages/block/blockList', { user, admin, profile, blockData, mainUrl })
                } else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
                }
        } catch (error) {
                console.log(error)
        }
})

router.get('/roomlist', async (req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage;

                        const roomResponse = await fetch(`${process.env.MAIN_URL}/api/room`)
                        const roomData = await roomResponse.json()

                        const blockResponse = await fetch(`${process.env.MAIN_URL}/api/block`)
                        const blockData = await blockResponse.json()
                        const mainUrl = process.env.MAIN_URL
                        res.render('pages/room/roomList', { user, admin, profile, roomData, blockData, mainUrl })
                } else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
                }
        } catch (error) {
                console.log(error)
        }
})

module.exports = router;