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
                        const response = await fetch(`${process.env.MAIN_URL}/api/block`)
                        const blockData = await response.json();
                        const mainUrl = process.env.MAIN_URL
                        const data = blockData.data
                        res.render('pages/attendance/block.ejs', { data, user, admin, profile, mainUrl})
                } else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
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
                        const response = await fetch(`${process.env.MAIN_URL}/api/room/block/${id}`)
                        const roomData = await response.json()
                        currentPage.block = id
                        const mainUrl = process.env.MAIN_URL
                        const data = roomData.data
                        res.render('pages/attendance/room',{user, admin, profile, data, mainUrl})
                }else {
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
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
                        const response = await fetch(`${process.env.MAIN_URL}/api/student/room?room=${room}&block=${block}`)
                        const data = await response.json()
                        const mainUrl = process.env.MAIN_URL
                        res.render('pages/attendance/attendanceForm', {user, admin, profile, data, mainUrl}) 
                }else{
                        res.redirect(`${process.env.MAIN_URL}/sh/login`)
                }
        } catch (error) {
             console.log(error)   
        }
})
module.exports = router;