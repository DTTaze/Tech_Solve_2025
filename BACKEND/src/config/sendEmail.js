require("dotenv").config();

module.exports = {
  GMAIL: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
};