const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

let db;
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

// app.use(express.static(__dirname));
// -----------------------------------------

app.get('/', function (req, res) {
  console.log('Handling GET request to /');
  res.set('Content-Type', 'text/html');
  res.sendFile(__dirname + '/index.html');
});

app.get('/styles/style.css', function (req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(__dirname + '/styles/style.css');
});

// -----------------------------------------

app.get('/write', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.sendFile(__dirname + '/pages/write.html');
});

app.get('/styles/write.css', function (req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(__dirname + '/styles/write.css');
});

// -----------------------------------------

app.post('/add', function (req, res) {
  res.send('Data submitted');
  db.collection('counter').findOne(
    { name: 'postCount' },
    function (error, result) {
      console.log(result.totalPost);
      let totalPostCount = result.totalPost;

      db.collection('post').insertOne(
        {
          _id: totalPostCount + 1,
          taskName: req.body.taskName,
          taskDue: req.body.taskDue,
        },
        function () {
          console.log('data saved');
          db.collection('counter').updateOne(
            { name: 'postCount' },
            { $inc: { totalPost: 1 } },
            function (error, result) {
              if (error) return console.log('error');
            }
          );
        }
      );
    }
  );
});

app.get('/views', function (req, res) {
  db.collection('post')
    .find()
    .toArray(function (error, result) {
      console.log(result);
      res.render(__dirname + '/views/list.ejs', { posts: result });
    });
});
