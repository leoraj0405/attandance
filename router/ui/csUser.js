const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

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
            res.render('pages/home.ejs', { user, admin })
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

router.get('/warden/restPassword', async (req, res) => {
    try {
        res.render('pages/restPassword.ejs')

    } catch (error) {
        console.error(error)
    }
})

router.get('/warden/:id',async (req, res) => {
    try {
        console.log('ok2')
        const id = req.params.id;
        const response = await fetch(`http://localhost:4000/api/user/${id}`)
        const data = await response.json();
        res.render('pages/profile.ejs',{data})
    } catch (error) {
        console.error(error)
    }
})
router.get('/warden/method2/restPassword2',(req, res) => {
    res.render('pages/restPassword2.ejs')
})


module.exports = router;