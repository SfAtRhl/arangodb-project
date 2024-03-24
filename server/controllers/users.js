import { setupArangoDB } from "../config/db.js";
import User from "../models/User.js";
import { findUserById, updateUser } from "../services/user.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await setupArangoDB();
    const user = await findUserById(db, id.replace("_", "/"));
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const db = await setupArangoDB();
    const user = await findUserById(db, id.replace("_", "/"));
    const friend = await findUserById(db, friendId.replace("_", "/"));
    if (!user.friends) {
      user.friends = [];
    }

    if (!friend.friends) {
      friend.friends = [];
    }

    if (user.friends.includes(friend._id)) {
      user.friends = user.friends.filter((id) => id !== friend._id);
      friend.friends = friend.friends.filter((id) => id !== user._id);
    } else {
      user.friends.push(friend._id);
      friend.friends.push(user._id);
    }
    await updateUser(db, user);

    const friends = await Promise.all(
      user.friends.map((friendId) => findUserById(db, friendId))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    console.log(formattedFriends);

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
