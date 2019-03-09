const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/login', (req, res) => {
    res.send('Login!');
});

router.get('/register', (req, res) => {
    res.send('Register!');
});

module.exports = router;