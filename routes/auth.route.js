const express = require('express');
const {
  register,
  login,
  logout,
  renderLogin,
  renderSignup
} = require('../controllers/auth.controller');


const router = express.Router();

// Routes
router.get('/login', renderLogin);
router.get('/signup', renderSignup);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.get('/admin', (req, res) => {
  
    if (req.session.user && req.session.user.isAdmin) {
      res.render('admin');
    } else {
      res.redirect('/auth/login');
    }
});

router.get('/user', (req, res) => {
    if (req.session.user && !req.session.user.isAdmin) {
      res.render('user');
    } else {
      res.redirect('/auth/login');
    }
});

  

module.exports = router