const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    movieId: Number,
    title: String,
    poster_path: String,
    overview: String,
    release_date: String,
});

module.exports = mongoose.model('Favorites', favoriteSchema);
