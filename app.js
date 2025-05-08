const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');

const authRoutes = require('./routes/auth.route');
const adminRoutes = require('./routes/admin.route');
const userRoutes = require('./routes/user.route');
const isAuthenticated = require('./middlewares/isAuthenticated');

dotenv.config();

const app = express();

// ✅ إعداد Handlebars
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: false,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// ✅ Routes
app.use('/auth', authRoutes);
app.use(isAuthenticated);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// ✅ Default Route
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

module.exports = app;
