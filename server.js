const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const path = require('path');
// const dotenv = require('dotenv');
// const { engine } = require('express-handlebars');
// const authRoutes = require('./routes/auth.route'); // بدون .js

// dotenv.config();

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const app = express();

// // Handlebars setup
// app.engine('hbs', engine({ extname: '.hbs', defaultLayout: false }));
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }));

// app.use('/auth', authRoutes);

// app.get('/', (req, res) => {
//   res.redirect('/auth/login');
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on http://localhost:${process.env.PORT}`);
// });
