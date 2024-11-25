const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const path = require('path');


router.get('/login', (req, res) => {
    try {
        res.render('pages/login.ejs')
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

                res.render('pages/home.ejs', { user, admin, profile })
            console.log(profile)
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
                res.redirect('http://localhost:4000/sh/login')
            })
        } else {
            res.redirect("http://localhost:4000/sh/login")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get('/signup', (req, res) => {
    res.render('pages/signup.ejs')
})

router.get('/user/profile',(req, res) => {
    try {
            if (req.session.isLogged == true) {
                const userInfo = req.session.data
                const user = req.session.data
                const admin = req.session.data.isAdmin;
                const profile = req.session.data.profileImage;
                res.render('pages/users/userProfile.ejs', {userInfo, user, admin, profile})
            } else {
                    res.redirect('http://localhost:4000/sh/login')
            }
    } catch (error) {
            console.error(error)  
    }
})

router.get('/user/restPassword',(req, res) => {
    res.render('pages/restPassword.ejs')
})


module.exports = router;