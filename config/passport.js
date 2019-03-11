const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load user model
const User = mongoose.model("user");

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: "email" }, (email, password, done) => {
            // Match user
            User.findOne({
                email: email
            }).then(user => {
                // No user found with that email
                if (!user) {
                    return done(null, false, { message: "No user found." });
                }

                // User found, now match the password password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Invalid password." });
                    }
                });
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
