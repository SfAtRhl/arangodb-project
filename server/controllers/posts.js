import { setupArangoDB } from "../config/db.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { getCommentByPost, insertIntoComments } from "../services/comment.js";
import {
  getLatestPosts,
  getPostbyId,
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
      occupation: user.occupation,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    };

    await insertIntoPosts(db, newPost);
    const posts = await getLatestPosts(db);

    res.status(201).json(posts);
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
    const db = await setupArangoDB();
    const posts = await getUserLatestPosts(db, userId.replace("_", "/"));
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getAllComment = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await setupArangoDB();
    const posts = await getCommentByPost(db, id.replace("_", "/"));
    res.status(200).json(posts);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;
    const db = await setupArangoDB();

    const userExists = await db.collection("users").documentExists(userId);

    const postExists = await db
      .collection("posts")
      .documentExists(id.replace("_", "/"));

    if (!userExists || !postExists) {
      return res.status(404).json({ message: "User or post not found" });
    }

    const commentDoc = {
      userId,
      postId: id.replace("_", "/"),
      comment,
      createdAt: new Date(),
    };

    const result = insertIntoComments(db, commentDoc);
  
    res
      .status(201)
      .json({ message: "Comment added successfully", comment: result });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const db = await setupArangoDB();
    const post = await getPostbyId(db, id.replace("_", "/"));
    if (!post.likes) {
      post.likes = {};
    }
    const isLiked = post.likes.hasOwnProperty(userId);
    if (isLiked) {
      delete post.likes[userId];
    } else {
      post.likes[userId] = true;
    }
    await db.collection("posts").replace(post._id, post);
    const updatedPost = await getPostbyId(db, id.replace("_", "/"));

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
