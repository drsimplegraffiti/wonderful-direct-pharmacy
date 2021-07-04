const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const connectDB = require('./config/db');


// Load Config
dotenv.config({ path: './config/config.env' });
connectDB();

// Passport config
require('./config/passport')(passport)

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// Logging to console details
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
};

// Handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');


// view engine @handlebars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

// Sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ uri: process.env.MONGO_URI, collection: 'mySessions' }),
    })
);


// set Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})

//Static folder
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/drugs', require('./routes/drugs'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))