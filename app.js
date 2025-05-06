const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Profile = require('./models/Profile');
require('./db');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static('public')); 

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user = await User.findOne({ email });
  if (!user) return done(null, false);
  const match = await bcrypt.compare(password, user.password);
  return match ? done(null, user) : done(null, false);
}));


app.use('/auth', require('./routes/auth'));
app.use('/api/comments', require('./routes/comments'));

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/Books&Co/Index.html'); 
  }
  res.redirect('/login');
});


app.get('/login', (req, res) => res.render('login'));


app.post('/login', (req, res, next) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return res.send('Please enter both email and password.');
  }
  console.log({email, password});
  
  passport.authenticate('local', {
    successRedirect: 'public/Books&Co/Index.html',
    failureRedirect: '/login'
  })(req, res, next);

});
app.get('/signup', (req, res) => res.render('signup'));


app.get('/home', (req, res) => {
  res.redirect('/Books&Co/Index.html');
});


app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/login'));
});


app.get('/api/profile', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  
  const profile = await Profile.findOne({ user: req.user._id });
  res.json({
    username: req.user.username || req.user.email || 'Guest',
    savedSearches: profile?.savedSearches || []
  });
});


app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });

  let profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    profile = new Profile({ user: req.user._id, savedSearches: [] });
  }

  if (!profile.savedSearches.includes(query)) {
    profile.savedSearches.unshift(query);
    profile.savedSearches = profile.savedSearches.slice(0, 5);
    await profile.save();
  }

  res.json({ savedSearches: profile.savedSearches });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
