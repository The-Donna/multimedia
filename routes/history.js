const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Not logged in' });
}


router.post('/', ensureAuthenticated, async (req, res) => {
  const { title, type, itemId } = req.body;
  const userId = req.user._id;

  try {
    let profile = await Profile.findOne({ user: userId });

   
    if (!profile) {
      profile = new Profile({ user: userId, history: [], savedSearches: [] });
    }

    profile.history.unshift({ title, type, itemId });
    profile.history = profile.history.slice(0, 20); 
    console.log("✅ History saved:", title);
    res.status(200).send('History updated');
  } catch (err) {
    console.error("❌ Error saving history:", err);
    res.status(500).send('Error updating history');
  }
});


router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.json(profile?.history || []);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).send('Error fetching history');
  }
});

module.exports = router;
