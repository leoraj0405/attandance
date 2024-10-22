const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/:id', async (req, res) => {
    try {
        if (req.session.isLogged == true) {
            const user = req.session.data
            const id = req.params.id;

            var response = await fetch(`http://localhost:4000/api/room/block/${id}`)
            var data = await response.json();
            res.render('pages/room.ejs', { data, user })
        } else {
            res.redirect('http://localhost:4000/sh/login')
        }
    } catch (error) {

    }

})

module.exports = router;