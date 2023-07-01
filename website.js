const express = require('express');
const app = express();

// Set up your website routes
app.get('/', (req, res) => {
  res.send('Welcome to My Bot Website!');
});

// Start the server
const port = 3000; // Specify the desired port number
app.listen(port, () => {
  console.log(`Website is running on port ${port}`);
});
