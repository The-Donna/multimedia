const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  username: String,
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: String
});

module.exports = mongoose.model('User', userSchema);