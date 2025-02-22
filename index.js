const express = require('express');
const multer = require('multer');
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

const messages = []
const users = {}

const generateRandomId = () => 'x-' + Math.random().toString(36).substr(2, 9);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        const username = req.body.username || 'anonymous';
        const newFilename = `${username}_${Date.now()}${path.extname(file.originalname)}`;
        users[username] = newFilename
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });

app.get('/api/data', (req, res) => {
    res.json({
        messages,
        users
    }
    )
});

app.post('/api/message', (req, res) => {
    const data = req.body;

    console.log(data)

    messages.push({
        id: generateRandomId(),
        img: users[data.name],
        name: data.name,
        message: data.message
    })

    res.status(200).json({
        message: 'Data received successfully'
    });
});

app.post('/api/upload', upload.single('profilePic'), (req, res) => {
    const username = req.body.username;
    const profilePic = req.file;

    if (!username || !profilePic) {
        return res.status(400).send("Username and profile picture are required.");
    }

    // Save the user info to the database or process as needed
    console.log("Username:", username);
    console.log("Profile Picture:", profilePic.filename);

    res.status(200).send("Profile created successfully!");
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});