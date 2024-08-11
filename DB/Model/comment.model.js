import mongoose, { model, Schema, Types } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: Types.ObjectId,
      ref: "Post",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    image: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.models.Comment || model("Comment", commentSchema);
export default commentModel;
