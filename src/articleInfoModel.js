import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 4, unique: true },
    upVotes: { type: Number, required: true, default: 0, min: 0 },
    comments: {
      type: [
        {
          username: { type: String, required: true, minlength: 4 },
          text: { type: String, required: true, minlength: 5 },
        },
      ],
      default: [],
    },
  },
  {
    strict: true,
  }
);

articleSchema.virtual('commentLength', () => {
  return this.comments.length;
});
const articleModel = mongoose.model('article', articleSchema, 'article');

export default articleModel;
