const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

// Connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/TestDB", { })
    .then(()=> console.log('MongoDb connected'))
    .catch(err => console.log(err));

// Load product schema
require('./models/Product');
const Product = mongoose.model('product');



// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Routes
app.get('/', (req, res) =>{
    const title = "Index Title";

    res.render('index', { title });
});

app.get('/about', (req, res) =>{
    res.render('about');
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});