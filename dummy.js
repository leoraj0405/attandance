// const express = require('express');
// const multer = require('multer');
const path = require('path');
const fs = require('fs')
// const execQuery = require('./utils/query');
// const { error } = require('console');
// var FormData = require('form-data');
// const axios = require('axios');

// const app = express();
// const PORT = 3000;

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // save files in the uploads folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// // File upload route
// app.post('/upload', upload.single('myfile'), async (req, res) => {

//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }
//   const uploadedFile = req.file.filename

//   const fileUploadResult = await execQuery(`INSERT INTO demo (filePath) VALUES (?)`, [uploadedFile])

//   if (fileUploadResult.affectedRows === 0) {
//     return res.status(403).send('Cannot modified')
//   }
//   res.status(200).send({ message: 'File uploaded successfully!', filename: uploadedFile });

// });

// app.get('/', async (req, res) => {
//   res.render('form')
// })

// app.get('/readsinglefile/:id', async (req, res) => {
//   const id = req.params.id
//   const getFileSingleRes = await execQuery(/*sql*/`SELECT * FROM demo WHERE id = ?`, [id])

//   if (!getFileSingleRes.length) {
//     return res.status(404).send('No Data')
//   }
//   const imagePath = getFileSingleRes[0].filePath
//   const filePath = path.join(__dirname, 'uploads', imagePath)

//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       return res.status(500).send('Error Occured')
//     }

//     res.sendFile(filePath, (error) => {
//       if (error) {
//         res.status(500).send('Error Occured ')
//       }
//     })
//   })
// });

// app.get('/readfile', async (req, res) => {
//   const pathArr = []
//   const form = new FormData()
//   const getFileRes = await execQuery(/*sql*/`SELECT * FROM demo`)

//   if (!getFileRes.length) {
//     res.status(404).send('No File')
//   } else {
//     for (var i = 0; i < getFileRes.length; i++) {
//       const filePath = path.join(__dirname, 'uploads', getFileRes[i].filePath)
//       fs.access(filePath, fs.constants.F_OK, async (err) => {
//         if (err) {
//           return res.status(500).send('Error Occured')
//         }
//         form.append('images', filePath)

//         const response = await axios.post('http://localhost:3000/readfile', form, {
//           headers: {
//             ...form.getHeaders(), // Include necessary headers from form-data
//           },
//         });

//        console.log(response.data)
//       })
//     }
    
//   }
// })


// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const app = express();

// Serve static files like profile images
app.use('/uploads', express.static('uploads'));

// Example user data (replace with your database logic)
const users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        profileImage: 'john.jpg', // Path to the profile image
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        profileImage: 'jane.jpg', // Path to the profile image
    },
];

const responseUser = {
  id : 0,
  name:'',
  email:''
}

// API endpoint to get all users
app.get('/api/users', (req, res) => {
  for(var i=0; i<users.length; i++) {
    const filePath = path.join(__dirname, 'public/uploads', users[i].profileImage)
    console.log(filePath)
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(200).sendFile(err)
      }

      // responseUser.id = users[i].id;
      // responseUser.name = users[i].name;
      // responseUser.email = users[i].email;
      // responseUser.image = users[i].filePath;


      // res.status(200).sendFile(filePath, (error) => {
      //   if (error) {
      //     res.status(500).send(invalidUserProfilePath)
      //   }
      // })
    })
  }

  res.sendFile(responseUser)

});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
