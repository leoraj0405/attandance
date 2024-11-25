const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


router.get('/asstdir', async (req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage
                        const userResponse = await fetch(`http://localhost:4000/api/user`)
                        const userData = await userResponse.json()
                        res.render('pages/users/userList.ejs',{userData, profile, user, admin})
                } else {
                        res.redirect('http://localhost:4000/sh/login')
                }
        } catch (error) {
                console.error(error)
        }
})

router.get('/addad',(req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const pageName = 'Add'
                        res.render('pages/users/userAdd.ejs', {pageName, profile:'', data : {}, user, admin, inputType:{}})
                } else {
                        res.redirect('http://localhost:4000/sh/login')
                }
                
        } catch (error) {
                console.error(error)  
        }
})

router.get('/editad/:id', async(req, res) => {
        try {
                const id = req.params.id;
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage
                        const pageName = 'Edit'
                        const response = await fetch(`http://localhost:4000/api/user/${id}`)
                        const data = await response.json()
                        const inputType = 'disabled'
                        res.render('pages/users/userAdd.ejs', {pageName, profile, data, inputType, user, admin})
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
                                page : pageInput,
                                limit : limitInput,
                        } = req.query
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage;
                        const response = await fetch(`http://localhost:4000/api/student?page=${pageInput}&limit=${limitInput}`)
                        const studentInfo = await response.json()
                        const currentPage = studentInfo.page 
                        var pagesTotal = Math.ceil(studentInfo.total / studentInfo.limit)
                        res.render('pages/student/studentList.ejs', {user, profile, admin, ...studentInfo, pagesTotal, currentPage})
                } else {
                        res.redirect('http://localhost:4000/sh/login')
                }
        } catch (error) {
                console.error(error)
        }
})

module.exports = router;