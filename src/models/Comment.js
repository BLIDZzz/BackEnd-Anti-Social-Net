const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, 'El texto del comentario es obligatorio'],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El userId es obligatorio'],
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'El postId es obligatorio'],
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 👁️ Atributo Virtual: isVisible
// Calcula dinámicamente si el comentario expiro según el límite de meses configurado en .env
commentSchema.virtual('isVisible').get(function () {
  const maxAgeMonths = parseInt(process.env.COMMENT_MAX_AGE_MONTHS, 10) || 6;
  const now = new Date();
  const limitDate = new Date(this.createdAt);
  limitDate.setMonth(limitDate.getMonth() + maxAgeMonths);

  return now <= limitDate;
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;