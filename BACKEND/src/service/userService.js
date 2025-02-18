import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import bluebird from "bluebird";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const createNewUser = async (email, password, username) => {
  let hashPassword = hashUserPassword(password);
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "studyenglish",
    Promise: bluebird,
  });
  const [rows, fields] = await connection.execute(
    "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
    [email, hashPassword, username]
  );
};

const getUserList = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "studyenglish",
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
    host: "localhost",
    user: "root",
    database: "studyenglish",
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
    host: "localhost",
    user: "root",
    database: "studyenglish",
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

module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
  getUserByID,
};
