const express = require('express');
const router = express.Router();
const Favorites = require('../models/Favorites');


router.post('/', async (req, res) => {
    try {
        const favorite = new Favorites(req.body);
        await favorite.save();
        res.status(201).json({ message: 'Favorite saved' });
    } catch (err) {
        console.error('Error saving favorite:', err);
        res.status(500).json({ error: 'Failed to save favorite' });
    }
});

module.exports = router;


