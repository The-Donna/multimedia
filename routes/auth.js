const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

router.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.send('User already exists');

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });
  await user.save();

  req.login(user, (err) => {
    if (err) return next(err);
    return res.redirect('/Books&Co/Index.html');
  });
});

router.post('/login', (req, res, next) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return res.send('Please enter both email and password.');
  }

  passport.authenticate('local', {
    successRedirect: '/Books&Co/Index.html',
    failureRedirect: '/login'
  })(req, res, next);
});

module.exports = router;
