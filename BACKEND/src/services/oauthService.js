const { Resend } = require("resend");
require("dotenv").config
const resend = new Resend(process.env.GMAIL_API_KEY); 
const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.User;
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const generateToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const sendResetEmail = async (Email) => {
  try {
    const token = generateToken(Email);
    const backendURL = process.env.BACKEND_URL;
    const resetLink = `${backendURL}/api/auth/reset_password?token=${token}`; 
    console.log("Sending email to:", Email); // Debug email đầu vào
    const response = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: Email,
        subject: "Reset your email",
        html: `<p>Click vào <a href="${resetLink}">đây</a> để đặt lại mật khẩu.</p>`,
    });

    console.log("Email sent successfully!", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const resetPassword = async (token, newPassword) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        if (!email) throw Error ("Missing email from decoded email token")
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        
        const user = await User.findOne({ where: email });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        
        await user.update({
            password : hashedPassword,
        })
        return { email, newPassword };
      } catch (error) {
        throw new Error("Invalid or expired token");
      }    
}

module.exports = { 
    sendResetEmail,
    resetPassword,

};
