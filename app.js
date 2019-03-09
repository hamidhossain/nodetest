const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/TestDB", { useNewUrlParser: true })
    .then(()=> console.log('MongoDb connected'))
    .catch(err => console.log(err));

// Load product schema
require('./models/Product');
const Product = mongoose.model('product');

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});

// Routes
app.get('/', (req, res) => {
    const title = "Index Title";

    res.render('index', { title });
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Product list
app.get('/products', (req, res) => {
    Product.find({})
        .sort({ date: 'desc' })
        .then(products => {
            res.render('products/index', {
                products: products
            });
        });
})

// Product add form
app.get('/products/add', (req, res) => {
    res.render('products/add');
});

// Product edit form
app.get('/products/edit/:id', (req, res) => {
    Product.findOne({
        _id: req.params.id
    })
    .then(product => {
        res.render('products/edit', {
            product
        });

    })
    
});

// Product add process
app.post('/products', (req, res) => {
    let errors = [];

    if (!req.body.itemNo) {
        errors.push({ text: 'Number is a required filed.' });
    }

    if (!req.body.prodName) {
        errors.push({ text: 'Name is a required filed.' });
    }

    if (errors.length > 0) {
        res.render('products/add', {
            errors: errors,
            itemNo: req.body.itemNo,
            prodName: req.body.prodName
        });
    } else {
        const newProduct = {
            itemNo: req.body.itemNo,
            prodName: req.body.prodName
        }

        new Product(req.body)
            .save()
            .then(product => {
                req.flash('success_msg', 'Product added successfully.');
                res.redirect('/products');
            });
    }
    
});

// Product edit process
app.put('/products/:id', (req, res) => {
    Product.findOne({
        _id: req.params.id
    }).then(product => {
        product.itemNo = req.body.itemNo;
        product.prodName = req.body.prodName;
        product.save()
            .then(product => {
                req.flash('success_msg', 'Product updated successfully.');
                res.redirect('/products');
            });
    })    
});

// Product delete
app.delete('/products/:id', (req, res) => {
    Product.deleteOne({ 
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Product deleted successfully.');
        res.redirect('/products');
    });
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});