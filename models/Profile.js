const mongoose = require("mongoose");

const HistoryItemSchema = new mongoose.Schema({
  title: String,
  type: String,
  itemId: String,
  dateViewed: {
    type: Date,
    default: Date.now
  }
}, { _id: false }); // Optional: avoids creating _id for each subdoc

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  savedSearches: [String],
  viewedBooks: [String],
  viewedMovies: [String],
  history: [HistoryItemSchema]
});

module.exports = mongoose.model("Profile", ProfileSchema);
