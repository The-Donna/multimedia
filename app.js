require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Profile = require('./models/Profile');
const favoritesRoute = require('./routes/favorite');
require('./db');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
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


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).send('Unauthorized');
}


app.use('/auth', require('./routes/auth'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/favorites', favoritesRoute);
app.use('/api/books', require('./routes/books'));
app.use('/api/movies', require('./routes/movies'));
app.use(require('./routes/pages'));

const historyRoute = require('./routes/history');
app.use('/api/history', ensureAuthenticated, historyRoute);

const Favorites = require('./models/Favorites'); 

app.get('/', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/index.html');
  res.redirect('/login');
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', passport.authenticate('local', {
  successRedirect: '/index.html',
  failureRedirect: '/login'
}));

app.get('/signup', (req, res) => res.render('signup'));
app.get('/logout', (req, res) => req.logout(() => res.redirect('/login')));
app.get('/home', (req, res) => res.redirect('/index.html'));

app.get('/api/profile', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  const profile = await Profile.findOne({ user: req.user._id });
  res.json({
    username: req.user.username || req.user.email || 'Guest',
    savedSearches: profile?.savedSearches || []
  });
});

app.post('/api/search', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  let profile = await Profile.findOne({ user: req.user._id });
  if (!profile) profile = new Profile({ user: req.user._id, savedSearches: [] });

  if (!profile.savedSearches.includes(req.body.query)) {
    profile.savedSearches.unshift(req.body.query);
    profile.savedSearches = profile.savedSearches.slice(0, 5);
    await profile.save();
  }
  res.json({ savedSearches: profile.savedSearches });
});


app.get('/history', ensureAuthenticated, async (req, res) => {
  console.log("User:", req.user);

  let profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    profile = new Profile({ user: req.user._id, history: [], savedSearches: [] });
    await profile.save();
    console.log("🆕 Created profile for:", req.user.email);
  }

  const sorted = profile.history.sort((a, b) => new Date(b.dateViewed) - new Date(a.dateViewed));
  res.render('history', { history: sorted });
});

app.get('/favorites', ensureAuthenticated, async (req, res) => {
  try {
    const favorites = await Favorites.find({ userId: req.user._id });
    res.render('favorites', { favorites });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).send('Server error');
  }
});



app.use((req, res) => {
  res.status(404).send("Custom 404: Page not found");
});



const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));