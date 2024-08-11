import commentModel from "../../../../DB/Model/comment.model.js";
import postModel from "../../../../DB/Model/post.model.js";
import Cloudinary from "../../../Services/Cloudinary.js";

export const createPost = async (req, res) => {
  const { title, caption } = req.body;
  const id = req.id;

  const { secure_url, public_id } = await Cloudinary.uploader.upload(
    req.file.path,
    { folder: `post` }
  );

  const post = await postModel.create({
    title,
    caption,
    image: { secure_url, public_id },
    userId: id,
  });
  return res.json({ message: "success", post });
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.id;
  const post = await postModel.findByIdAndUpdate(
    id,
    {
      $addToSet: { likes: userId },
      $pull: { unlikes: userId },
    },
    { new: true }
  );
  post.totalVote = post.likes.length - post.unlikes.length;
  await post.save();
  return res.status(200).json({ message: "success", post });
};
export const unLikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.id;
  const post = await postModel.findByIdAndUpdate(
    id,
    {
      $addToSet: { unlikes: userId },
      $pull: { likes: userId },
    },
    { new: true }
  );
  post.totalVote = post.likes.length - post.unlikes.length;
  await post.save();
  return res.status(200).json({ message: "success", post });
};

export const createComment = async (req, res) => {
  req.body.userId = req.id;
  req.body.postId = req.params.id;
  if (req.file) {
    const { secure_url, public_id } = await Cloudinary.uploader.upload(
      req.file.path,
      { folder: `comment` }
    );
    req.body.image = { secure_url, public_id };
  }
  const comment = await commentModel.create(req.body);
  return res.status(201).json({ message: "success", comment });
};

export const getAllPost = async (req, res) => {
  const cursor = await postModel
    .find({})
    .populate([
      {
        path: "userId",
        select: "name",
      },
    ])
    .cursor();

  const postList = [];
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const comment = await commentModel.find({ postId: doc._id });
    postList.push({ post: doc, comment });
  }

  return res.json({ message: "success", postList });
};
