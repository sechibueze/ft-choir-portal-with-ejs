const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const InitiateMongoServer = require('./model/db');
// const nodemailer = require("nodemailer");
const session = require('express-session');
const app = express();
dotenv.config();
app.use(cors());
InitiateMongoServer();

const port = process.env.PORT || 8000;

// const User = require('./model/user')

// Controllers
const signupController = require('./controllers/signup');
const loginController = require('./controllers/login');
const dashboardController = require("./controllers/dashboard");
const profileImageController = require('./controllers/profileImage')
// const checkAdmin = require('./middlewares/checkAdmin');
const adminController = require('./controllers/admin');
// cons t indexController = require('./middlewares/unitList');
// const unitsController = require('./controllers/unitsController');
// const authController = require('./controllers/authController');

// Set up express to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'keepitsecret', saveUninitialized: false, resave: false }));

// Static assests
app.use(express.static(path.join(__dirname, '/public/')));
// views & view engine
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'ejs');
app.use((req, res, next) => {
  res.locals.title = "";
  res.locals.data = {};
  res.locals.message = '';
  res.locals.admin = {};
  next();
});

app.use('/signup', signupController);

app.use('/login', loginController);

app.use("/dashboard", dashboardController);

app.use('/profileimage', profileImageController);

app.use('/admin', adminController);

app.use('/', (req, res) => {

  res.json({
    message: 'FTC2020 is running '
  })
});

app.listen(port, () => {
  console.log(`App running on :  ${port}`);
});
