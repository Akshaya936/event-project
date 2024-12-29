const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',  // your MySQL host
    user: 'root',       // your MySQL username
    password: '',       // your MySQL password
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

// Example route to register a user for an event
app.post('/register', (req, res) => {
    const { user_id, event_id } = req.body;
    const query = 'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)';
    db.query(query, [user_id, event_id], (err, results) => {
        if (err) {
            res.status(500).send('Error registering user');
        } else {
            res.status(200).send('User registered for event');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
