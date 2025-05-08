const express = require('express');
const router = express.Router();


router.get('/login', (req, res) => {
    try {
        const mainUrl = process.env.MAIN_URL
        res.render('pages/login.ejs', {mainUrl})
    } catch (error) {
        console.error(error)
    }
})
router.get('/home', (req, res) => {
    try {
        if (req.session.isLogged == true) {
            const user = req.session.data
            const admin = req.session.data.isAdmin;
            const profile = req.session.data.profileImage
            const mainUrl = process.env.MAIN_URL

            res.render('pages/home.ejs', { user, admin, profile, mainUrl })
        }

    } catch (error) {
        console.error(error)
    }
})

router.get('/logout', (req, res) => {
    try {
        if (req.session.isLogged == true) {
            req.session.destroy((err) => {
                if (err) {
                    console.error(err)
                    return
                }
                res.redirect(`${process.env.MAIN_URL}/sh/login`)
            })
        } else {
            res.redirect(`${process.env.MAIN_URL}/sh/login`)
        }
    } catch (error) {
        console.error(error)
    }
})

router.get('/signup', (req, res) => {
    res.render('pages/signup.ejs')
})

router.get('/user/profile', (req, res) => {
    try {
        if (req.session.isLogged == true) {
            const userInfo = req.session.data
            const user = req.session.data
            const admin = req.session.data.isAdmin;
            const profile = req.session.data.profileImage;
            const mainUrl = '<%= mainUrl %>'
            res.render('pages/users/userProfile.ejs', { userInfo, user, admin, profile, mainUrl })
        } else {
            res.redirect(`${process.env.MAIN_URL}sh/login`)
        }
    } catch (error) {
        console.error(error)
    }
})

router.get('/user/restPassword', (req, res) => {
    const mainUrl = process.env.MAIN_URL
    res.render('pages/restPassword.ejs', {mainUrl})
})


module.exports = router;