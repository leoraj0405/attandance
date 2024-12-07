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
                        const mainUrl = new URL(`http://localhost:4000/api/user`)
                        pageInput && mainUrl.searchParams.append('page', pageInput);
                        const userResponse = await fetch(mainUrl.href)
                        const userData = await userResponse.json()
                        const currentPage = userData.page
                        const pagesTotal = Math.ceil(userData.total / userData.limit)
                        res.render('pages/users/userList.ejs', { ...userData, profile, user, admin, currentPage, pagesTotal })
                } else {
                        res.redirect('http://localhost:4000/sh/login')
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
                        res.render('pages/users/userAdd.ejs', { pageName, profile: '', data: {}, user, admin, inputType: {} })
                } else {
                        res.redirect('http://localhost:4000/sh/login')
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
                        const response = await fetch(`http://localhost:4000/api/user/${id}`)
                        const data = await response.json()
                        console.log(data)
                        const inputType = 'disabled'
                        res.render('pages/users/userAdd.ejs', { pageName, profile, data, inputType, user, admin })
                } else {
                        res.redirect('http://localhost:4000/sh/login')
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
                        const mainUrl = new URL(`http://localhost:4000/api/student`)
                        pageInput && mainUrl.searchParams.append('page', pageInput);
                        currentWarden && mainUrl.searchParams.append('warden', currentWarden);

                        const response = await fetch(mainUrl.href)
                        const studentInfo = await response.json()
                        const studentList = 'No students'
                        const currentPage = studentInfo.page
                        var pagesTotal = Math.ceil(studentInfo.total / studentInfo.limit)
                        res.render('pages/student/studentList.ejs', { user, profile, admin, ...studentInfo, pagesTotal, currentPage, studentList })
                } else {
                        res.redirect('http://localhost:4000/sh/login')
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

                        const wardenResponse = await fetch(`http://localhost:4000/api/user/admin/getwarden`)
                        const wardenList = await wardenResponse.json()

                        const blockRes = await fetch(`http://localhost:4000/api/block`)
                        const blockList = await blockRes.json()

                        const deptRes = await fetch(`http://localhost:4000/api/department`)
                        const deptList = await deptRes.json()


                        res.render('pages/student/addStudent.ejs', {
                                pageName,
                                studentProfile,
                                data: {},
                                inputType,
                                user,
                                admin,
                                wardenList,
                                blockList,
                                deptList
                        })
                } else {
                        res.redirect('http://localhost:4000/sh/login')
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

                        const wardenResponse = await fetch(`http://localhost:4000/api/user/admin/getwarden`)
                        const wardenList = await wardenResponse.json();

                        const blockRes = await fetch(`http://localhost:4000/api/block`)
                        const blockList = await blockRes.json();

                        const deptRes = await fetch(`http://localhost:4000/api/department`)
                        const deptList = await deptRes.json();

                        const response = await fetch(`http://localhost:4000/api/student/${id}`)
                        const data = await response.json()

                        console.log(data)

                        res.render('pages/student/addStudent.ejs', {
                                pageName,
                                studentProfile,
                                data,
                                user,
                                admin,
                                wardenList,
                                blockList,
                                deptList
                        })
                } else {
                        res.redirect('http://localhost:4000/sh/login')
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
                        const blockResponse = await fetch(`http://localhost:4000/api/block`)
                        const blockData = await blockResponse.json()
                        res.render('pages/block/blockList', { user, admin, profile, blockData })
                } else {
                        res.redirect('http://localhost:4000/sh/login')
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

                        const roomResponse = await fetch(`http://localhost:4000/api/room`)
                        const roomData = await roomResponse.json()
                        console.log(roomData)
                        res.render('pages/room/roomList', {user, admin, profile, blockData : {}})
                }else{
                        res.redirect('http://localhost:4000/sh/login')
                }
        } catch (error) {
                console.log(error)
        }
})



// router.get('/demo', (req, res) =>{
//         const data = [
//                 { name: "Alice", age: 25 },
//                 { name: "Bob", age: 30 },
//                 { name: "Charlie", age: 22 },
//               ];
//         res.render('pages/demo2', {data})
// })
module.exports = router;