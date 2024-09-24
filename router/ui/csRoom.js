const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/userRoom/:id',async (req,res) =>{
    const id = req.params.id;
    var response = await fetch(`http://localhost:4000/api/room/block/${id}`)
    var data = await response.json();
    res.render('pages/room.ejs', {data})
})

module.exports = router;