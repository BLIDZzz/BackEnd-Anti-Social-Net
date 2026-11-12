const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, 'El texto del comentario es obligatorio'],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El user es obligatorio'],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'El post es obligatorio'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.virtual('isVisible').get(function () {
  const maxAgeMonths = parseInt(process.env.COMMENT_MAX_AGE_MONTHS, 10) || 6;
  const now = new Date();
  const limitDate = new Date(this.createdAt);
  limitDate.setMonth(limitDate.getMonth() + maxAgeMonths);

  return now <= limitDate;
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

module.exports = Comment;