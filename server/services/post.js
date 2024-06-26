import { aql } from "arangojs";

export const getLatestPosts = async (db) => {
  try {
    const query = aql`
      FOR post IN posts
      RETURN post
    `;

    const cursor = await db.query(query);
    const latestPosts = await cursor.all();
    return latestPosts;
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    throw error;
  }
};
export const getUserLatestPosts = async (db, userId) => {
  try {
    const query = aql`
      FOR post IN posts
      FILTER post.userId == ${userId}
      RETURN post
    `;

    const cursor = await db.query(query);
    const userPosts = await cursor.all();
    return userPosts;
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    throw error;
  }
};

export const getPostbyId = async (db, postId) => {
  try {
    const postCollection = db.collection("posts");
    const cursor = await db.query(aql`
      FOR post IN ${postCollection}
      FILTER post._id == ${postId}
      LIMIT 1
      RETURN post
    `);
    const post = await cursor.next();
    return post;
  } catch (error) {
    console.error("Error fetching post by Id:", error);
    throw error;
  }
};
export const insertIntoPosts = async (db, post) => {
  try {
    const postsCollection = db.collection("posts");
    const cursor = await db.query(aql`
      INSERT ${post} INTO ${postsCollection} RETURN NEW
    `);
    const Savedpost = await cursor.next();
    return Savedpost;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
