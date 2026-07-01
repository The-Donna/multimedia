const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movieId: Number, 
    bookId: String,  
    title: String,
    poster_path: String,
    overview: String,    
    release_date: String, 
    thumbnail: String,   
    description: String  
});

// Prevent the same user favoriting the same movie or book twice.
// Sparse so a doc missing one of the two fields doesn't collide on `null`.
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true, sparse: true });
favoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Favorites', favoriteSchema);