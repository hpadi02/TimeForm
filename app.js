require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.static('public'));

// Import and use the events route
const eventsRouter = require('./server/routes/events');
app.use('/api/events', eventsRouter);

// Default route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
