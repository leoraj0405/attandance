const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const currentPage = {
        block: 0,
        room : 0
}

router.get('/blocks', async (req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage;
                        const response = await fetch(`http://localhost:4000/api/block`)
                        const data = await response.json();
                        console.log(data)
                        res.render('pages/attendance/block.ejs', { data, user, admin, profile})
                } else {
                        res.redirect('http://localhost:4000/sh/login')
                }
        } catch (error) {
                console.error(error)
        }

})

router.get('/rooms/:id', async(req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const id = req.params.id
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage;
                        const response = await fetch(`http://localhost:4000/api/room/block/${id}`)
                        const data = await response.json()
                        currentPage.block = id
                        res.render('pages/attendance/room',{user, admin, profile, data})
                }else {
                        res.redirect('http://localhost:4000/sh/login')
                } 
        } catch (error) {
                console.error(error)
        }
})

router.get('/students/:id', async (req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const room = req.params.id
                        const block = currentPage.block
                        const user = req.session.data
                        const admin = req.session.data.isAdmin;
                        const profile = req.session.data.profileImage;  
                        const response = await fetch(`http://localhost:4000/api/student/room?room=${room}&block=${block}`)
                        const data = await response.json()
                        res.render('pages/attendance/attendanceForm', {user, admin, profile, data}) 
                }else{
                        res.redirect('http://localhost:4000/sh/login')
                }
        } catch (error) {
             console.log(error)   
        }
})
module.exports = router;