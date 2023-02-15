const express = require('express');
const app = express();

app.listen(8080, function () {
  console.log('listening on 8080');
});

app.get('/', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function (req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(__dirname + 'styles/style.css');
});
