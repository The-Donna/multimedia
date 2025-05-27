const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: Number, 
    bookId: String,  
    title: String,
    poster_path: String,
    overview: String,
    release_date: String,
});

module.exports = mongoose.model('Favorites', favoriteSchema);
