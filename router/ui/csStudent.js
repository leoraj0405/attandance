const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/:id',async (req,res) =>{
    try {
        if(req.session.isLogged == true) {
            const warden = req.session.data;
            const user = req.session.data
            const id = req.params.id;
            const response = await fetch(`http://localhost:4000/api/student/room/${id}`)
            const data = await response.json();
            const studCount = data.length
            res.render('pages/student.ejs',{data, ...warden, user, studCount})
        }else {
            res.redirect('http://localhost:4000/sh/login')
        }
        
    } catch (error) {
        console.error(error)
    }
   
})

router.get('/studentList',(req, res) => {
    try {
        if(req.session.isLogged == true) {
            
        }
    } catch (error) {
        console.log(error)
    }

})

// router.get('/editAttendance', async (req, res) => {
// })

module.exports = router;