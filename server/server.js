const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// EJS is rendered on the server.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files(CSS, JS, images）from client/.
app.use(express.static(path.join(__dirname, '../client')));

// Server-rendered page.
app.get('/', (req, res) => {
  res.render('index', {
    name: 'Alex Johnson',
    major: 'Computer Science',
    isTA: true
  });
});

// Simple API endpoint used by the Axios demo.
app.get('/api/hello', (req, res) => {
  res.status(200).json({
    message: 'Hello from the server!'
  });

  // res.status(404).json({
  //   error: 'The hello request not found on the server.'
  // });

  // res.status(500).json({
  //   error: 'The hello request failed on the server.'
  // });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
