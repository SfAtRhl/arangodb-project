import { aql } from "arangojs";

export const findUserByEmail = async (db, email) => {
  try {
    const userCollection = db.collection("users");
    // Perform a query to find the user by email
    const cursor = await db.query(aql`
      FOR user IN ${userCollection}
      FILTER user.email == ${email}
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
