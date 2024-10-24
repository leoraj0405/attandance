const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    try {
        if (req.session.isLogged == true) {
            const user = req.session.data
            const blockId = req.query.block;

            console.log(blockId)
            var response = await fetch(`http://localhost:4000/api/room/block/${blockId}`)
            var data = await response.json();

            // console.log(data)

            // const total = data2.studTotalCountInRoom
            // const stud = data2.todayPutAttStudCountInRoom

            // const percentage = (stud / total) * 100

            // const roundedUp = Math.ceil(percentage);

            // console.log(roundedUp)
            res.render('pages/room.ejs', { data, user })
        } else {
            res.redirect('http://localhost:4000/sh/login')
        }
    } catch (error) {

    }

})

module.exports = router;