require("dotenv").config();
import bcrypt from "bcryptjs";
const { Op } = require("sequelize");
const db = require("../models/index.js");
const User = db.User;
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const createNewUser = async (email, password, username) => {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      throw new Error("User already exists");
    }

    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      email: email,
      password: hashPassword,
      username: username,
    });
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // Create an access token
    const payload = {
      email: user.email,
      username: user.username,
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      EC: 0,
      access_token,
      user: {
        email: user.email,
        username: user.username,
      },
    };
  } catch (error) {
    throw new Error(`Error logging in: ${error.message}`);
  }
};

const getUserList = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

const deleteUser = async (id) => {
  try {
    const result = await User.destroy({
      where: { id: id },
    });

    if (result === 0) {
      throw new Error("User not found");
    }

    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

const getUserByID = async (id) => {
  try {
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const updateUserInfor = async (data) => {
  try {
    let user = await User.findOne({ where: { id: data.id } });
    if (!user) {
      throw new Error("User not found");
    }

    user.username = data.username;
    user.email = data.email;
    await user.save();

    return await User.findAll();
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

const findOrCreateUser = async (profile) => {
  try {
    let user = await User.findOne({
      where: {
        [Op.or]: [{ email: profile.emails[0].value }, { googleId: profile.id }],
      },
    });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
        password: null,
      });
    }

    return user;
  } catch (error) {
    throw new Error(`Error finding or creating user: ${error.message}`);
  }
};

module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
  getUserByID,
  updateUserInfor,
  findOrCreateUser,
  loginUser,
};
