const mongoose = require("mongoose");

const ReelCommentLikeSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cid: { type: mongoose.Schema.Types.ObjectId, ref: "ReelComment" }
}, { timestamps: true });

module.exports = mongoose.model("ReelCommentLike", ReelCommentLikeSchema);
