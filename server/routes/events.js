const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

// Configure MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Route to handle form submission
router.post('/submit-event', (req, res) => {
    const { eventName, location, personName, startDate, endDate, dateSlider, relatedEvents } = req.body;

    if (!eventName || !location) {
        return res.status(400).json({ error: "Event name and location are required." });
    }

    const query = `
        INSERT INTO events (event_name, location, person_name, start_date, end_date, date_slider, related_events)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [eventName, location, personName, startDate, endDate, dateSlider, relatedEvents];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Failed to submit event." });
        }
        res.status(200).json({ message: "Event submitted successfully!", eventId: result.insertId });
    });
});

// Route to retrieve a specific event by ID
router.get('/:eventId', (req, res) => {
    const { eventId } = req.params;

    const query = `SELECT * FROM events WHERE id = ?`;
    db.query(query, [eventId], (err, results) => {
        if (err) {
            console.error("Error retrieving event:", err);
            return res.status(500).json({ error: "Failed to retrieve event." });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Event not found." });
        }
        res.status(200).json(results[0]);
    });
});

// Route to retrieve events based on search criteria
router.get('/events', (req, res) => {
    const { startDate, endDate, personName } = req.query;
    let query = "SELECT * FROM events WHERE 1=1"; // Base query with a true condition
    const values = [];

    // Add date range criteria if provided
    if (startDate) {
        query += " AND start_date >= ?";
        values.push(startDate);
    }
    if (endDate) {
        query += " AND end_date <= ?";
        values.push(endDate);
    }

    // Add person name criteria if provided
    if (personName) {
        query += " AND person_name LIKE ?";
        values.push(`%${personName}%`);
    }

    // Execute the query
    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Error retrieving events:", err);
            return res.status(500).json({ error: "Failed to retrieve events." });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
