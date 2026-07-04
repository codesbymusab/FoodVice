const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  provider: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: function () {
      return this.provider === "local";
    }
  },
  profilePhoto: { type: String, default: "https://firebasestorage.googleapis.com/v0/b/foodvice-838f6.firebasestorage.app/o/profile%2Fdafault.jpg?alt=media&token=2d96d6d2-346e-4996-bfd9-6fd664268a85" },
  address: String,
  bio: String,
  level: { type: Number, default: 1 },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
  banned: { type: Boolean, default: false },
  banReason: { type: String, default: null },
  banUntil: { type: Date, default: null },
  dateJoined: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema)