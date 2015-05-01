// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

var mongoose = require('mongoose');
//mongoose.connect('mongodb://admin:admin@ds063909.mongolab.com:63909/stopwatch') Online
//mongoose.connect('')


var User     = require('./models/users');
var Email     =require('./models/emails');


// ROUTES FOR OUR API and Main
// =============================================================================
var api_router = express.Router();              // get an instance of the express Router
var router =express.Router();

// middleware to use for all API requests
app.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});



// test API route to make sure everything is working (accessed at GET http://localhost:8080/api)
app.use(express.static(__dirname));

api_router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});



// more routes for our API will happen here
//on routes that end in /users
// ----------------------------------------------------
api_router.route('/users')

    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {

        var user = new User();      // create a new instance of the User model
        user.name = req.body.name;  // set the users name (comes from the request)
        user.email = req.body.email;
        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
    }).get(function(req, res){
    User.find(function(err, users) {
                if (err){
                res.send(err);
                }

            res.json(users);
        });

});

api_router.route('/users/:user_id')

    // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
        .put(function(req, res) {

        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;  // update the users info

            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });
    })   // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// API Email Routes

api_router.route('/emails')
    .post(function(req,res){
        var email = new Email();
        console.dir(req.body);
        email.from = req.body.from;
        email.subject = req.body.subject;
        email.to = req.body.to;
        email.message = req.body.message;
        email.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'Email Created :)' });
        });
    })
    .get(function(req,res){
        //    Email.find(function(err, emails) {
        //         if (err){
        //         res.send(err);
        //         }

        //     res.json(emails);
        // });
           // Dummy data 
            res.json(
            [{
            from:'nils@gmail.com',
            to:'herp@gmail.com',
            message:'hej hej hur r lget',
            sent_at:'20140405',
            subject:'tja'
            },{
            from:'Victor@gmail.com',
            to:'Sven@gmail.com',
            message:'hej hej hur rasdfasdfasadfgagag lget',
            sent_at:Date.now(),
            subject:'tja asdf asdf'
            }]);
        
        });

 



// REGISTER OUR ROUTES -------------------------------
// all of our api_routes will be prefixed with /api
app.use('/api', api_router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
