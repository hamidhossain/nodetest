const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load product schema
require('../models/Product');
const Product = mongoose.model('product');

// Product list
router.get('/', (req, res) => {
    Product.find({})
        .sort({ date: 'desc' })
        .then(products => {
            res.render('products/index', {
                products: products
            });
        });
})

// Product add form
router.get('/add', (req, res) => {
    res.render('products/add');
});

// Product edit form
router.get('/edit/:id', (req, res) => {
    Product.findOne({
        _id: req.params.id
    })
    .then(product => {
        res.render('products/edit', {
            product
        });
    });  
});

// Product add process
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    Product.deleteOne({ 
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Product deleted successfully.');
        res.redirect('/products');
    });
});

module.exports = router;