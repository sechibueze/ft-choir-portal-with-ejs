const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const InitiateMongoServer = require('./model/db');

const session = require('express-session');
const app = express();
dotenv.config();
InitiateMongoServer();

const port = process.env.PORT || 8000;

// Controllers
const indexController = require("./controllers/index");
const signupController = require('./controllers/signup');
const loginController = require('./controllers/login');
const dashboardController = require("./controllers/dashboard");
const profileImageController = require('./controllers/profileImage')
const notifyController = require("./controllers/notification")
const adminController = require('./controllers/admin');
const logoutController = require("./controllers/logout");
const settingsController = require("./controllers/settings");

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
  res.locals.data = {};
  next();
});
app.use("/", indexController);
app.use('/signup', signupController);
app.use('/login', loginController);
app.use("/dashboard", dashboardController);
app.use('/profileimage', profileImageController);
app.use('/notify', notifyController);
app.use('/admin', adminController);
app.use("/settings", settingsController); //out of page
app.use("/logout", logoutController);

app.use((req, res) => {
  return res.render("404");
});

app.listen(port, () => {
  console.log(`App running on :  ${port}`);
});
