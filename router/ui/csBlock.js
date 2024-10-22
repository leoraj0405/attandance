const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


router.get('/', async (req, res) => {
        try {
                if (req.session.isLogged == true) {
                        const user = req.session.data
                        var response = await fetch(`http://localhost:4000/api/block`)
                        var data = await response.json();
                        res.render('pages/block.ejs', { data, user})
                } else {
                        res.redirect('http://localhost:4000/sh/login')
                }
        } catch (error) {
                console.error(error)
        }

})
module.exports = router;