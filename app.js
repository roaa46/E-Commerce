const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.route');
const adminRoutes = require('./routes/admin.route');
const userRoutes = require('./routes/user.route');
const isAuthenticated = require('./middlewares/auth/isAuthenticated');

dotenv.config();

// ✅ إنشاء التطبيق
const app = express();

// ✅ إعداد Handlebars مع Helpers
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: false,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ✅ تحليل البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ طبقات الأمان
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser());

// ✅ إعداد السيشن
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
  }
}));

// ✅ لوج السيشن
app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session content:", req.session);
  next();
});

// ✅ ملفات الستاتيك
app.use(express.static(path.join(__dirname, 'public')));

// ✅ الراوتات العامة
app.use('/auth', authRoutes);

// ✅ بعد تسجيل الدخول فقط
 app.use(isAuthenticated);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// ✅ الراوت الرئيسي
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// ✅ تصدير التطبيق
module.exports = app;