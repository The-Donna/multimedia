const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  savedSearches: [String],
  viewedBooks: [String], 
  viewedMovies: [String], 
});

module.exports = mongoose.model("Profile", ProfileSchema);
