const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    _id: {
        type: mongoose.Types.ObjectId, auto: true
    },
    name: String, 
    grade: Number 
}, { versionKey: false });

schema.statics.Get = function(where = {}, sort = {}) {
    return this.find(where).sort(sort);
}

const User = mongoose.model("Users", schema);

module.exports = User;