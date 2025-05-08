const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    try {
        if (req.session.isLogged == true) {
            const user = req.session.data
            const blockId = req.query.block;

            var response = await fetch(`${process.env.MAIN_URL}/api/room/block/${blockId}`)
            var data = await response.json();

            res.render('pages/room.ejs', { data, user })
        } else {
            res.redirect(`${process.env.MAIN_URL}/sh/login`)
        }
    } catch (error) {

    }

})

module.exports = router;