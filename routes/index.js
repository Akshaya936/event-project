// routes/index.js
const express = require('express');
const router = express.Router();

// Render home page
router.get('/', (req, res) => {
  res.render('index');
});

// Render event creation page
router.get('/create-event', (req, res) => {
  res.render('event');
});

// Render events listing page
router.get('/events', (req, res) => {
  // Logic to fetch events from database if necessary
  res.render('events', { events: [] }); // Sample data
});

// POST route for creating an event (this will later connect to MongoDB)
router.post('/create-event', (req, res) => {
  const { name, date, location } = req.body;
  console.log(`Event created: ${name}, ${date}, ${location}`);
  // Logic to save the event to the database
  res.redirect('/events');
});

module.exports = router;
