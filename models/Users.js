const mongoose = require('mongoose');

const schema = new mongoose.Schema({ name: String, grade: Number });

const User = mongoose.model("Users", schema);

module.exports = User;