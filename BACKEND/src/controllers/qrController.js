const qrService = require("../services/qrService");

const handleCreateQR = async (req, res) => {
  try {
    const { text } = req.query;
    if (!text) return res.error(400, "Missing text query!");
    const result = await qrService.createQR(text);
    res.success("Created QR successfully!", result);
  } catch (error) {
    res.error(500, "Missing text query!", error.message);
  }
};
module.exports = { handleCreateQR };
