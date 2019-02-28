const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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

// Routes
app.get('/', (req, res) => {
    const title = "Index Title";

    res.render('index', { title });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/product', (req, res) => {
    Product.find({})
        .sort({ date: 'desc' })
        .then(products => {
            res.render('product/index', {
                products: products
            });
        });
})

app.get('/product/add', (req, res) => {
    res.render('product/add');
});

app.get('/product/edit/:id', (req, res) => {
    Product.findOne({
        _id: req.params.id
    })
    .then(product => {
        res.render('product/edit', {
            product
        });

    })
    
});

app.post('/product', (req, res) => {
    let errors = [];

    if (!req.body.itemNo) {
        errors.push({ text: 'Number is a required filed.' });
    }

    if (!req.body.prodName) {
        errors.push({ text: 'Name is a required filed.' });
    }

    if (errors.length > 0) {
        res.render('product/add', {
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
                res.redirect('/product');
            });
    }
    
});

app.put('/product/:id', (req, res) => {
    Product.findOne({
        _id: req.params.id
    }).then(product => {
        product.itemNo = req.body.itemNo;
        product.prodName = req.body.prodName;
        product.save()
            .then(product => {
                res.redirect('/product');
            });
    })    
});

app.delete('/product/:id', (req, res) => {
    Product.deleteOne({ 
        _id: req.params.id
    }).then(() => {
        res.redirect('/product');
    });
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});