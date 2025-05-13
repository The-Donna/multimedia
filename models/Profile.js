const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  savedSearches: [String],
  viewedBooks: [String],
  viewedMovies: [String],
  history: [
    {
      title: String,
      type: String,
      itemId: String,
      dateViewed: { type: Date, default: Date.now }
    }
  ]
});


module.exports = mongoose.model("Profile", ProfileSchema);
