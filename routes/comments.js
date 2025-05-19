const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');


router.get('/:movieId', async (req, res) => {
    try {
        const comments = await Comment.find({ movieId: req.params.movieId }).sort({ timestamp: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/', async (req, res) => {
    const { movieId, username, comment } = req.body;
    if (!movieId || !username || !comment) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newComment = new Comment({ movieId, username, comment });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: 'Could not save comment' });
    }
});

module.exports = router;
