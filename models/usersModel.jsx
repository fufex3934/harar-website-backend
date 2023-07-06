const mongoose = require('mongoose');

// User model
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
  });

  module.exports =  mongoose.model('User', userSchema);