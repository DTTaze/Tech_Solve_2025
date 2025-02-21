import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import bluebird from "bluebird";
// import User from "../models/user.js";
import db from "../models/index.js";
const User = db.User;
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const createNewUser = async (email, password, username) => {
  let hashPassword = hashUserPassword(password);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    Promise: bluebird,
  });
  const [rows, fields] = await connection.execute(
    "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
    [email, hashPassword, username]
  );
};

const getUserList = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    Promise: bluebird,
  });
  try {
    const [rows, fields] = await connection.execute("SELECT * FROM users");
    return rows;
  } catch (e) {
    console.log("check error ", e);
  }
};

const deleteUser = async (id) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    Promise: bluebird,
  });
  try {
    const [rows, fields] = await connection.execute(
      "DELETE FROM users WHERE id=?",
      [id]
    );
    return rows;
  } catch (e) {
    console.log("check error ", e);
  }
};

const getUserByID = async (id) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    Promise: bluebird,
  });
  try {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM users WHERE id=?",
      [id]
    );
    return rows;
  } catch (e) {
    console.log("check error ", e);
  }
};

const updateUserInfor = async (email, username, id) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    Promise: bluebird,
  });
  try {
    const [rows, fields] = await connection.execute(
      "UPDATE users SET email=?, username=? WHERE id=?",
      [email, username, id]
    );
    return rows;
  } catch (e) {
    console.log("check error ", e);
  }
};

const findOrCreateUser = async (profile) => {
  let user = await User.findOne({ where: { email: profile.emails[0].value } });

  if (!user) {
    user = await User.create({
      email: profile.emails[0].value,
      name: profile.displayName,
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
