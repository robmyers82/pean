// lib/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User = require('../server/models/users');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            done(null, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

	        // find a user whose email is the same as the forms email
	        // we are checking to see if the user trying to login already exists
	        User.findOne({ where: { 'email' :  email } }).then(function(user) {

	            // check to see if theres already a user with that email
	            if (user) {
	                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
	            } else {

	                // if there is no user with that email
	                // create the user
	                User.create({
				     	name: '',
				     	email: email,
				     	password: password,
				   	}, {
				   		fields: ['name', 'email', 'password', 'createdAt', 'updatedAt']
				   	}).then(function(newUser) {
				   		console.log(newUser);
				   		return done(null, newUser);
				   	});
	            }

	        });    

    	});
    }));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ where: { 'email' :  email } }).then(function(user) {

                // check to see if theres already a user with that email
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'Email not registered.'));
                } 

                if (user.password != password) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                return done(null, user);

            });    

        });
    }));

};