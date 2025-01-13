const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000; // Port for the server

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route to check server status
app.get('/', (req, res) => {
    res.send('Event Planning System API is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
