const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true
    }
},  { 
        _id: true
});

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    images: {
        type: [imageSchema],
        default: []
    },

    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]

}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;