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

app.use(express.static('public'));
// -----------------------------------------

// app.get('/', function (req, res) {
//   console.log('Handling GET request to /');
//   res.set('Content-Type', 'text/html');
//   res.sendFile(__dirname + '/index.html');
// });

app.get('/', function (req, res) {
  console.log('Handling GET request to /');
  res.render('index.ejs');
});

// -----------------------------------------

app.get('/write', function (req, res) {
  res.render('write');
});

// -----------------------------------------

app.post('/add', function (req, res) {
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
              res.send("<script>alert('Data submitted')</script>");
            }
          );
        }
      );
    }
  );
});

// -----------------------------------------

app.get('/views', function (req, res) {
  db.collection('post')
    .find()
    .toArray(function (error, result) {
      console.log(result);
      res.render(__dirname + '/views/list.ejs', { posts: result });
    });
});

// -----------------------------------------

app.delete('/delete', function (req, res) {
  req.body._id = parseInt(req.body._id);
  console.log(req.body);

  db.collection('post').deleteOne(req.body);
  console.log('deleted');
  res.status(200).send({ message: 'successful' });
});
