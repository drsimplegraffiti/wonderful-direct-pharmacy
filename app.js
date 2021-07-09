const path = require('path');
const express = require('express');
const sendMail = require('./mail');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const connectDB = require('./config/db');
const User = require('./models/User');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const cors = require('cors');




// Load Config
dotenv.config({ path: './config/config.env' });
connectDB();

// Passport config
require('./config/passport')(passport)

const app = express();

//cors option
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use((req, res, next) => {
    res.on('header', function() {
        console.trace('HEADERS GOING TO BE WRITTEN');
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (res.header === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({ message: "header working" })
    }
    next();

})


// Body parser
// app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


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

// tyler potts passport 
passport.serializeUser(function(user, done) {
    done(null, user.id)
})
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

// Set global variable
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})


passport.use(new localStrategy(function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect email.' });

        bcrypt.compare(password, User.password, function(err, res) {
            if (err) return done(err);
            if (res === false) return done(null, false, { message: 'Incorrect password.' });

            return done(null, User);
        });
    });
}));


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/dashboard');
}

function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/');
}
// tyler potts passport 

//Static folder
app.use(express.static(path.join(__dirname, 'public')));


//email delivery
app.post('/email', (req, res) => {
    const { email, password } = req.body;
    console.log('Data: ', req.body);
    sendMail(email, password, function(err, data) {
        if (err) {
            res.status(500).json({
                message: err.message || 'Internal Error'
            });
        } else {
            res.json({ message: 'Email sent!!!' })
        }
    });
    res.json({ message: 'Message received!!!' })
})

// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/drugs', require('./routes/drugs'));
app.use('/', require('./routes/flutter'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))