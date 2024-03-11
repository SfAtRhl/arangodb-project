import { setupArangoDB } from "../config/db.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import {
  getLatestPosts,
  getUserLatestPosts,
  insertIntoPosts,
} from "../services/post.js";
import { findUserById } from "../services/user.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    // Initialize ArangoDB
    const db = await setupArangoDB();
    // Find the user by id
    const user = await findUserById(db, userId);
    // const user = await User.findById(userId);
    // console.log(user);
    const newPost = {
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    };

    const post = await insertIntoPosts(db, newPost);
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    // Initialize ArangoDB
    const db = await setupArangoDB();
    // Find all latest posts
    const posts = await getLatestPosts(db);
    // const post = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    // Initialize ArangoDB
    const db = await setupArangoDB();
    // Find all latest posts
    const posts = await getUserLatestPosts(db, userId);
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
