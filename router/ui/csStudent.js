const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/:id',async (req,res) =>{
    const id = req.params.id;
    const response = await fetch(`http://localhost:4000/api/student/room/${id}`)
    const data = await response.json();
    res.render('pages/student.ejs',{data})
})

module.exports = router;