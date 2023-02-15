const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, function () {
  console.log('listening on 8080');
});

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.sendFile(__dirname + '/index.html');
});

app.get('/styles/style.css', function (req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(__dirname + '/styles/style.css');
});

app.get('/pages', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.sendFile(__dirname + '/pages/write.html');
});

app.post('/add', function (req, res) {
  res.send('submit complete');
  console.log(req.body);
});
