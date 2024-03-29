const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

// Load user model
require('../models/User');
const User = mongoose.model('user');

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

// Login form post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/products',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.post('/register', (req, res) => {
    //console.log(req.body);
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({text: 'Passwords do not match!'});
    }

    if (req.body.password.length < 8) {
        errors.push({text: 'Password must be atleast 8 characters'});
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
        });
    } else {
        User.findOne({email: req.body.email})
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
            
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
            
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Registered successfully.');
                                    res.redirect('/users/login');
                                })
                                .catch( err => {
                                    console.log(err);
                                    return;
                                })
                        });
                    });
                }
            });
    }  
})

// User logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out successfully.');
    res.redirect('/users/login');
});

module.exports = router;