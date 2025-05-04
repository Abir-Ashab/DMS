// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/manager', require('./routes/manager'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/broker', require('./routes/broker'));
app.use('/api/hospital', require('./routes/hospital'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
