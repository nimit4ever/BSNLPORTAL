const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local');
const execFile = require('child_process').execFile;
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
require('dotenv').config();

// Require Models
const { User } = require('./models/users');

// Require Router
const authRoute = require('./routes/auth');
const areasRoute = require('./routes/areas');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/orders');
const feasibilitiesRoute = require('./routes/feasibilities');
const unitsRoute = require('./routes/units');
const itemsRoute = require('./routes/items');

// Connect to the Database
const InitiateMongoServer = require('./utils/connectDB');
execFile('C:/Program Files/MongoDB/Server/4.4/bin/mongod.exe', ['--version'], async (error, stdout, stderr) => {
  if (error) {
    console.log(error.message);
    await InitiateMongoServer(false);
  } else {
    await InitiateMongoServer(true); // true
  }
});

// Initialize all Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(flash());
app.locals.moment = require('moment');

// Passport configuration
app.use(
  require('express-session')({
    secret: 'Once again I am the Best!',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set Local variables
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.primary = req.flash('primary');
  res.locals.success = req.flash('success');
  res.locals.warning = req.flash('warning');
  res.locals.error = req.flash('error');
  next();
});

// Initialize Router
app.get('/', async (req, res) => {
  res.redirect('/users/dashboard');
});
app.use('/auth', authRoute);
app.use('/areas', areasRoute);
app.use('/users', usersRoute);
app.use('/orders', ordersRoute);
app.use('/feasibilities', feasibilitiesRoute);
app.use('/units', unitsRoute);
app.use('/feasibilities/:id/items', itemsRoute);

app.get('*', (req, res) => {
  res.render('./auth/404');
});

// Listening the Application
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
