const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

router.post('/', async (req, res) => {
  const { title, type, itemId } = req.body;
  const userId = req.user.id;

  try {
    const profile = await Profile.findOne({ user: userId });
    profile.history.unshift({ title, type, itemId });
    await profile.save();
    res.status(200).send('History updated');
  } catch (err) {
    res.status(500).send('Error updating history');
  }
});

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    res.json(profile.history);
  } catch (err) {
    res.status(500).send('Error fetching history');
  }
});

module.exports = router;