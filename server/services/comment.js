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

export const getCommentByPost = async (db, postId) => {
  try {
    const query = aql`
      FOR comment IN comments
        FILTER comment.postId == ${postId}
        LET user = (
          FOR u IN users
            FILTER u._id == comment.userId
            RETURN { 
              firstName: u.firstName,
              lastName: u.lastName, 
              userId : u._id,
              picturePath  : u.picturePath }
        )
        RETURN { comment, user: user[0] }
    `;

    const cursor = await db.query(query);

    const commentsWithUsers = await cursor.all();

    return commentsWithUsers;
  } catch (error) {
    console.error("Error fetching post by Id:", error);
    throw error;
  }
};
export const insertIntoComments = async (db, comment) => {
  try {
    if (!(await db.collection("comments").exists())) {
      await db.createCollection("comments");
    }
    const commentsCollection = db.collection("comments");
    const cursor = await db.query(aql`
      INSERT ${comment} INTO ${commentsCollection} RETURN NEW
    `);
    const Savedcomment = await cursor.next();
    return Savedcomment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
