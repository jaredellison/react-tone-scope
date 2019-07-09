const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 8000;

// Configure Middleware
app.use(morgan('dev'));

// Serve Static Files
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes

// Start Server
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});