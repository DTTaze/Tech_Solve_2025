const QRCode = require("qrcode");

const createQR = async (text) => {
  try {
    const qrImage = await QRCode.toDataURL(text);
    return qrImage;
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = { createQR };
