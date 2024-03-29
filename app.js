const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Load routes
const products = require('./routes/products');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// Db config
const db = require('./config/database');

// Connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(()=> console.log('MongoDb connected'))
    .catch(err => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    // this can be used now everywhere, such in navbar
    res.locals.user = req.user || null;
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

app.use('/products', products);
app.use('/users', users);

// to get the default port from Heroku or 5000
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});