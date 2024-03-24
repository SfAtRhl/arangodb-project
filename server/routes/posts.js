import express from "express";
import { commentPost, getAllComment, getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:id/comment", verifyToken, getAllComment);


/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* POST */
router.post("/:id/comment", verifyToken, commentPost);


export default router;
