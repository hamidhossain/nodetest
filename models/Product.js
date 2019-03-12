const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const ProdcutSchema = new Schema({
    itemNo: {
        type: String,
        required: true
    },
    prodName: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('product', ProdcutSchema);