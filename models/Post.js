const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({});

module.exports = Post = mongoose.model("post", ProfileSchema);
