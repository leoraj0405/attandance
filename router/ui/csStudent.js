const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/:id',async (req,res) =>{
    try {
        if(req.session.isLogged == true) {
            const warden = req.session.data;
            console.log(warden)
            const id = req.params.id;
            const response = await fetch(`http://localhost:4000/api/student/room/${id}`)
            const data = await response.json();
            // console.log(data)
            res.render('pages/student.ejs',{data, ...warden})
        }else {
            res.redirect('http://localhost:4000/sh/login')
        }
        
    } catch (error) {
        console.error(error)
    }
   
})

module.exports = router;