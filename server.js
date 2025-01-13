const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session'); // Import express-session

const app = express();
const port = 4000;

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',  // your MySQL host
    user: 'root',       // your MySQL username
    password: 'Akshay@06',       // your MySQL password
    database: 'event_planning' // your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to the database');
    }
});

// Middleware to parse incoming JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware - **Place this before the routes**
app.use(session({
    secret: 'supersecretkey',  // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set true if using HTTPS
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Example route to fetch all events
app.get('/events', (req, res) => {
    db.query('SELECT * FROM events', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching events');
        } else {
            res.json(results);
        }
    });
});

// Serve the homepage (index.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// User Registration
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send('Error hashing password');
        }

        // Insert user into database
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hash], (error, results) => {
            if (error) {
                console.error('Failed to register user:', error);
                return res.status(500).send('Error registering user');
            }
            res.send('User registered successfully!');
        });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Fetch user by username
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching user');
        }
        if (results.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = results[0];

        // Compare hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                // Store user data in session
                req.session.user = { id: user.id, username: user.username };
                res.redirect('/dashboard');  // Redirect after login
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    });
});

// Dashboard Route
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    res.sendFile(__dirname + '/dashboard.html');
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/login.html');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
