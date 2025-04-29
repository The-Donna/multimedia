const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  savedSearches: [String],
  viewedBooks: [String], // Optional for next phase
  viewedMovies: [String], // Optional
});

module.exports = mongoose.model("Profile", ProfileSchema);
