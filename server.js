const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace with real database in production)
let users = [];

// Routes
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password, // In production, hash this password!
        profileImage: 'https://via.placeholder.com/150',
        phone: '',
        gender: '',
        birthDate: '',
        cart: [],
        lastUpdated: new Date().toISOString()
    };

    users.push(newUser);
    res.status(201).json({ message: 'Registration successful', user: { ...newUser, password: undefined } });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({
            message: 'Login successful',
            user: { ...user, password: undefined }
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/update-profile', (req, res) => {
    const { username, updates } = req.body;
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex] = {
        ...users[userIndex],
        ...updates,
        lastUpdated: new Date().toISOString()
    };

    res.json({
        message: 'Profile updated successfully',
        user: { ...users[userIndex], password: undefined }
    });
});

app.post('/api/update-cart', (req, res) => {
    const { username, cart } = req.body;
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex].cart = cart;
    users[userIndex].lastUpdated = new Date().toISOString();

    res.json({
        message: 'Cart updated successfully',
        cart: users[userIndex].cart
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 