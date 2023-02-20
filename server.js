const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------------------

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(
  session({ secret: 'secretcode', resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// -----------------------------------------

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

app.get('/', function (req, res) {
  console.log('Handling GET request to /');
  res.render('index.ejs');
});

// -----------------------------------------
// Add task
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
// view / delete / edit task list
// -----------------------------------------

app.get('/list', function (req, res) {
  res.render('list');
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

// -----------------------------------------

app.put('/update', function (req, res) {
  req.body._id = parseInt(req.body._id);
  console.log(req.body);

  db.collection('post').updateOne(
    { _id: req.body._id },
    { $set: req.body },
    function (err, result) {
      if (err) {
        res.status(500).send({ message: 'error' });
      } else {
        console.log('updated');
        res.status(200).send({ message: 'successful' });
      }
    }
  );
});

// -----------------------------------------
// login authenticate
// -----------------------------------------

app.get('/login', function (req, res) {
  res.render('login');
});

// -----------------------------------------

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/fail' }),
  function (req, res) {
    응답.redirect('/');
  }
);
