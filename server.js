const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect(
  'mongodb+srv://admin:password1234@cluster0.iv5k38x.mongodb.net/?retryWrites=true&w=majority',
  function (error, client) {
    if (error) return console.log(error);

    db = client.db('todo-app');

    app.listen(8080, function () {
      console.log('listening on 8080');
    });
  }
);

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
  res.send('Data submitted');
  console.log(req.body.taskName);
  console.log(req.body.taskDue);

  db.collection('post').insertOne(
    { taskName: req.body.taskName, taskDue: req.body.taskDue },
    function () {
      console.log('data saved');
    }
  );
});
