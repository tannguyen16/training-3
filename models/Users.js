const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    _id: {
        type: mongoose.Types.ObjectId, auto: true
    },
    name: String, 
    grade: Number 
});

const User = mongoose.model("Users", schema);

module.exports = User;