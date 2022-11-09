const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    room: { type: String },
    author: { type: String},
    message: { type: String},
    time: { type: String},

  });
  
  module.exports = mongoose.model("Message", MessageSchema);