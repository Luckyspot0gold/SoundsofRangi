// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000; // Use port 8000

const server = http.createServer((req, res) => {
  // Serve the index.html file
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
  // Serve other files (like JS files)
  else {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Set the correct Content-Type for JS files
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
        res.writeHead(200);
        res.end(data);
      }
    });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  // Gitpod will automatically forward this port so you can preview it
});
