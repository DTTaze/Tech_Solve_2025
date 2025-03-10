console.log("\x1b[33m%s\x1b[0m", "/service/userService");
require("dotenv").config();
import bcrypt from "bcryptjs";
const { Op } = require("sequelize");
import db from "../models/index.js";
const User = db.User;
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const createNewUser = async (email, password, username) => {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      console.log("user is already existed");
      return null;
    }
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      email: email,
      password: hashPassword,
      username: username,
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return {
        EC: 1,
        EM: "email/pass ko hop le",
      };
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          EC: 2,
          EM: "email/pass ko hop le",
        };
      } else {
        //create an access token
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
      }
    }
  } catch (error) {
    throw error;
  }
};

const getUserList = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    return users;
  } catch (e) {
    console.log("\x1b[31m%s\x1b[0m","Error fetching users:", e);
    return null;
  }
};

const deleteUser = async (id) => {
  try {
    const result = await User.destroy({
      where: { id: id },
    });
    if (result === 0) {
      console.log("\x1b[31m%s\x1b[0m","User not found.");
    } else {
      console.log("User deleted successfully.");
    }
    return result;
  } catch (e) {
    console.log("\x1b[31m%s\x1b[0m","Error deleting user:", e);
  }
};

const getUserByID = async (id) => {
  try {
    const user = await User.findOne({
      where: { id: id },
    });
    if (!user) {
      console.log("\x1b[31m%s\x1b[0m","User not found.");
    }
    return user;
  } catch (e) {
    console.log("\x1b[31m%s\x1b[0m","Error fetching user:", e);
  }
};

let updateUserInfor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.username = data.username;
        user.email = data.email;
        await user.save();
        let allUsers = await User.findAll();
        resolve(allUsers);
      } else {
        resolve();
      }
    } catch (e) {
      console.log(e);
    }
  });
};

const findOrCreateUser = async (profile) => {
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
