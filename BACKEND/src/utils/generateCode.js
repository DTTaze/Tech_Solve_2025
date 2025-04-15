const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const generateCode = (prefix = "GD") => {
  const uuid = uuidv4();
  const hash = crypto.createHash("sha256").update(uuid).digest("hex");
  const shortCode = hash
    .slice(0, 12)
    .toUpperCase()
    .match(/.{1,4}/g)
    .join("-");
  return `${prefix}-${shortCode}`;
};

module.exports = { generateCode };
