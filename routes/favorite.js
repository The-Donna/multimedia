const express = require('express');
const router = express.Router();
const Favorites = require('../models/Favorites'); 

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated?.()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log("Received favorite body:", req.body); //
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

router.delete('/:itemId', ensureAuthenticated, async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id.toString();

  try {
    const result = await Favorites.deleteOne({
      userId,
      $or: [
        { bookId: itemId },
        { movieId: parseInt(itemId) } 
      ]
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});


module.exports = router;
