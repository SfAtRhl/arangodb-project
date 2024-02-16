import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { setupArangoDB } from "../config/db.js";
import { aql } from "arangojs";
import { findUserByEmail } from "../services/user.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Initialize ArangoDB
    const db = await setupArangoDB();

    // Check if the user already exists
    const existingUser = await findUserByEmail(db, email);

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with this email already exists." });
    }
    // Insert the new user into the database
    const newUser = {
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    };

    const insertUserQuery = aql`
      INSERT ${newUser} INTO ${db.collection("users")} RETURN NEW
    `;

    const result = await db.query(insertUserQuery);
    // const savedUser = result.next();

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Initialize ArangoDB
    const db = await setupArangoDB();
    // Find the user by email
    const user = await findUserByEmail(db, email);

    // Retrieve the user from the cursor
    if (!user) {
      return res.status(400).json({ msg: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
