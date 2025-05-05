const axios = require("axios");
const apiKey = process.env.GHN_TOKEN_DEVELOPMENT;
const ghnBaseUrl = process.env.GHN_URL_DEVELOPMENT;
const headers = {
  "Content-Type": "application/json",
  Token: apiKey,
};

const createOrder = async (shipmentData) => {
  try {
    const url = `${ghnBaseUrl}/v2/shipping-order/create`;
    const response = await axios.post(url, shipmentData, { headers });
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error:", errData);
    throw new Error(errData);
  }
};

const getOrderInfo = async (order_code) => {
  const url = `${ghnBaseUrl}/v2/shipping-order/detail`;
  try {
    const response = await axios.post(
      url,
      { order_code: order_code },
      { headers }
    );
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error:", errData);
    throw new Error(errData);
  }
};

const updateOrder = async (updateData) => {
  const url = `${ghnBaseUrl}/v2/shipping-order/update`;
  try {
    const response = await axios.post(url, updateData, { headers });
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error:", errData);
    throw new Error(errData);
  }
};

const cancelOrder = async (order_code) => {
  const url = `${ghnBaseUrl}/v2/switch-status/cancel`;
  try {
    const response = await axios.post(
      url,
      { order_codes: [order_code] },
      { headers }
    );
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error:", errData);
    throw new Error(errData);
  }
};
module.exports = { createOrder, getOrderInfo, updateOrder, cancelOrder };
