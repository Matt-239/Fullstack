const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');
const mongoose = require('mongoose'); 


const app = express();
const secretKey = 'secretKey';
const server = http.createServer(app);
const io = socketIo(server);


dbURI = "mongodb+srv://mprice239:FbaMOio4rVkizpRJ@cluster0.cbbhvr6.mongodb.net/Chat?retryWrites=true&w=majority";
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const User = require('./models/user');
const Room = require('./models/room');
const Message = require('./models/message');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    // If token is valid, save decoded user information in request object
    req.userId = decoded.id;
    next();
  });
}


app.get('/', (req, res) => {
    // test to see if database is connected
    // Room.find()
    // .then(rooms => {
    //     console.log('Rooms:', rooms);
    // })
    // .catch(err => console.error('Error getting rooms:', err));

    // User.find()
    // .then(users => {
    //     console.log('Users:', users);
    // })
    // .catch(err => console.error('Error getting users:', err));

    // Message.find()
    // .then(messages => {
    //     console.log('Messages:', messages);
    // })
    // .catch(err => console.error('Error getting messages:', err));

    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/signup', async (req, res) => {
    const { username, password, first_name, last_name } = req.body;
    try {
        const existing = await User.findOne({
            username: username
        });
        console.log('Existing:', existing);
        if (existing) {
            return res.status(400).send('Username already exists');
        }

        console.log('Creating new user');
        const newUser = new User({
            username: username,
            password: password,
            firstname: first_name,
            lastname: last_name
        });
        console.log('New user:', newUser);
        newUser.save()
        .then(() => {
            console.log('User saved');
            res.status(201).send('User created');
        })
        .catch(err => console.error('Error saving user:', err));
    } catch (err) {
        console.error('Error signing up:', err);
        res.status(500).send('Error signing up');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username, password: password });
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: 3600 }); // Expires in 1 hour
    res.redirect('/rooms-list');

  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

app.get('/rooms-list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rooms-list.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});


io.on('connection', (socket) => {
    console.log('New user connected', socket.id);
    socket.send('Welcome to the chat app');
});




const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});