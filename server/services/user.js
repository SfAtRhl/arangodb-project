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
    const cursor = await db.query(aql`
      FOR user IN ${userCollection}
      FILTER user._id == ${id}
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

export const updateUser = async (db, user) => {
  try {
    const userCollection = db.collection("users");

    const cursor = await db.query(aql`
      UPDATE ${user._id}
      WITH ${user}
      IN ${userCollection}
    `);

    // const updatedUser = await cursor.next();
    // console.log(updatedUser);

    // return updatedUser;
  } catch (err) {
    const code = 500;
    console.error("Error updating user:", err, code);
    throw err;
  }
};
