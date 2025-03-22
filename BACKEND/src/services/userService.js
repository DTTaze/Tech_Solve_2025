require("dotenv").config();
import bcrypt from "bcryptjs";
const { Op } = require("sequelize");
const db = require("../models/index.js");
const User = db.User;
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const createUser = async (data) => {
  try {
    let { email, password, username, full_name, phone_number, address } = data;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      throw new Error("User already exists");
    }

    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      email: email,
      password: hashPassword,
      username: username,
      full_name: full_name,
      phone_number: phone_number,
      address: address,
    });
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const loginUser = async (data) => {
  try {
    let { username, email, password } = data;
    if (!email && !username) {
      throw new Error("Vui lòng cung cấp email hoặc username");
    }
    let condition = email ? { email } : { username };
    const user = await User.findOne({ where: condition });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // Create an access token
    const payload = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      username: user.username,
      role_id: user.role_id,
      avatar_url: user.avatar_url,
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      EC: 0,
      access_token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        role_id: user.role_id,
        avatar_url: user.avatar_url,
      },
    };
  } catch (error) {
    throw new Error(`Error logging in: ${error.message}`);
  }
};

const getAllUsers = async () => {
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

const updateUser = async (id, data) => {
  try {
    let { username, email, full_name, address, phone_number } = data;
    let user = await User.findOne({ where: { id: id } });
    if (!user) {
      throw new Error("User not found");
    }
    full_name
      ? (user.full_name = full_name)
      : (user.full_name = user.full_name);
    address ? (user.address = address) : (user.address = user.address);
    phone_number
      ? (user.phone_number = phone_number)
      : (user.phone_number = user.phone_number);
    user.username = username;
    user.email = email;
    await user.save();

    return await User.findAll();
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

const findOrCreateUser = async (profile) => {
  try {
    const [user] = await User.findOrCreate({
      where: {
        [Op.or]: [{ email: profile.emails[0].value }, { googleId: profile.id }],
      },
      defaults: {
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
        password: null,
      },
    });

    return user;
  } catch (error) {
    throw new Error(`Error finding or creating user: ${error.message}`);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  getUserByID,
  updateUser,
  findOrCreateUser,
  loginUser,
};
