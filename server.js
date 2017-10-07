//*****1. require express********
// Load the express module that we install using npm
var express = require("express");
var app = express();
//require mongoose
var mongoose = require('mongoose');
//format date
var moment = require('moment');
moment().format();

//***PARSE DATA*****
// require body-parser
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
// our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quotes_dojo'); //basic_mongoose is the name of my db

//create schema
var UserSchema = new mongoose.Schema({
 name: { type: String, required: true, minlength: 2},
 quote: { type: String, required: true},
},{timestamps: true });

//If I would another user to have more atributes I need to create another Schema
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

//**** 2. create routes ********
app.get('/', function(request, response) {
  response.render('index')
  console.log("its working");
});

//****POST ROUTE*****
// route to process new user form data:
app.post('/quotes', function (req, res){
  console.log("POST DATA ", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var user = new User({name: req.body.name, quote : req.body.quote});
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  user.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      res.render('index', {errors: user.errors})
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      //redirect the user back to the root route.
      res.redirect('/display_Quotes')
    }
  })
});

app.get('/display_Quotes', function(request, response) {
  User.find({}, function (err, users) {
    if(err){
      console.log(err);
    }else {
      response.render('quotes', {users_quotes: users, moment: moment})
    }
  })
});

//******3 Call the listen function
// Tell the express app to listen on port 8000
app.listen(8000, function() {
  console.log("listening on port 8000");
})
