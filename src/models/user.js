const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nickName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;