const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')


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
            const userName = req.session.data.firstName
            // console.log(req.session.data)
            res.render('pages/home.ejs', { userName })
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

router.get('/warden/forgetPass', async (req, res) => {
    try {
        var response = await fetch(`http://localhost:4000/api/user`)
        var data = await response.json();
        // console.log(data)
        res.render('pages/forgetPass.ejs', {data})

    } catch (error) {
        console.error(error)
    }
})
module.exports = router;