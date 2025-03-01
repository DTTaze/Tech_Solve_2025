import bcrypt from "bcryptjs";
const { Op } = require("sequelize");

// import User from "../models/user.js";
import db from "../models/index.js";
const User = db.User;
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const createNewUser = async (email, password, username) => {
  try {
    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      email: email,
      password: hashPassword,
      username: username,
    });

    console.log("User created:", newUser.toJSON());

    return newUser;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      console.error("Error: Email already exists.");
    } else {
      console.error("Error creating user:", error);
    }
  }
};
const getUserList = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (e) {
    console.log("Error fetching users:", e);
  }
};

const deleteUser = async (id) => {
  try {
    const result = await User.destroy({
      where: { id: id },
    });
    if (result === 0) {
      console.log("User not found.");
    } else {
      console.log("User deleted successfully.");
    }
    return result;
  } catch (e) {
    console.log("Error deleting user:", e);
  }
};

const getUserByID = async (id) => {
  try {
    const user = await User.findOne({
      where: { id: id },
    });
    if (!user) {
      console.log("User not found.");
    }
    return user;
  } catch (e) {
    console.log("Error fetching user:", e);
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
};
