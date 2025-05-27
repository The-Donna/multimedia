const express = require('express');
const router = express.Router();
const Favorites = require('../models/Favorites');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// Add a favorite
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        const favorite = new Favorites({
            userId: req.user._id,
            ...req.body
        });
        await favorite.save();
        res.status(201).json({ message: 'Favorite saved' });
    } catch (err) {
        console.error('Error saving favorite:', err);
        res.status(500).json({ error: 'Failed to save favorite' });
    }
});

module.exports = router;
