const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    movieId: { type: String, required: true },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

CommentSchema.index({ movieId: 1, timestamp: -1 });

module.exports = mongoose.model('Comment', CommentSchema);