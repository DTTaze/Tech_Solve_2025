require("dotenv").config;
const { sendEmail } = require('../config/sendEmail');
const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.User;
const Role = db.Role;
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const googleAuthCallback = async (user) => {
  try {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayStr = today.toISOString().split("T")[0];

    const userWithRoles = await User.findOne({
      where: { id: user.id },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name"],
        },
      ],
    });

    const payload = {
      id: user.id,
      role_id: userWithRoles.role_id,
      role_name: userWithRoles.roles?.name,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      address: user.address,
      coins_id: user.coins_id,
      streak: user.streak,
      last_completed_task: user.last_completed_task,
      avatar_url: user.avatar_url,
      google_id: user.google_id,
    };

    const access_token = jwt.sign(payload, process.env.JWT_AT_SECRET, {
      expiresIn: process.env.JWT_AT_EXPIRE,
    });
    const refresh_token = jwt.sign(payload, process.env.JWT_RF_SECRET, {
      expiresIn: process.env.JWT_RF_EXPIRE,
    });
    return {
      access_token,
      refresh_token,
      user: payload,
    };
  } catch (error) {
    throw error;
  }
};

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_AT_SECRET, { expiresIn: "1h" });
};

const sendResetEmail = async (Email) => {
  try {
    const user = await User.findOne({ where: { email: Email } });
    if (!user) {
      throw new Error("Email not found");
    }
    const token = generateToken(Email);
    const backendURL = process.env.BACKEND_URL;
    const resetLink = `${backendURL}/api/auth/reset_password?token=${token}`;
    console.log("Sending email to:", Email); 
    
    const sender = {email: 'bao0908235279@gmail.com', name: 'GreenFlag'};
    const receiver = {email: Email, name: user.full_name};
    const subject = "Reset Password";
    const html = `
      <h1>Reset Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
    `;
    const response = await sendEmail(sender, receiver, subject, html);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_AT_SECRET);
    const email = decoded.email;
    if (!email) throw Error("Missing email from decoded email token");
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    const user = await User.findOne({ where: email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    await user.update({
      password: hashedPassword,
    });
    return { email, newPassword };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendResetEmail,
  resetPassword,
  googleAuthCallback,
};
