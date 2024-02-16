import { aql } from "arangojs";

export const getLatestPosts = async (db) => {
  try {
    const query = aql`
      FOR post IN posts
      SORT post.createdAt DESC
      RETURN post
    `;
    // LIMIT ${limit}

    const cursor = await db.query(query);
    const latestPosts = await cursor.all();

    return latestPosts;
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    throw error;
  }
};

export const findUserById = async (db, id) => {
  try {
    const userCollection = db.collection("users");
    // Perform a query to find the user by email
    const cursor = await db.query(aql`
      FOR user IN ${userCollection}
      FILTER user._key == ${id}
      LIMIT 1
      RETURN user
    `);
    const user = await cursor.next();
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
