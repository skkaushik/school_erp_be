// src/server.js
const express = require('express');
const app = express();
const PORT = require('./constants/app.constants').PORT;

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'School ERP Backend is running.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
