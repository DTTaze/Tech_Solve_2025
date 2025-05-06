const axios = require("axios");
const ghnBaseUrl = process.env.GHN_URL_DEVELOPMENT;

const buildHeaders = (token, shop_id) => ({
  "Content-Type": "application/json",
  Token: token,
  ShopId: shop_id,
});

const createOrder = async (shipmentData, token, shop_id) => {
  try {
    const url = `${ghnBaseUrl}/v2/shipping-order/create`;
    const response = await axios.post(url, shipmentData, {
      headers: buildHeaders(token, shop_id),
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (createOrder):", errData);
    throw new Error(errData);
  }
};

const getOrderInfo = async (order_code, token, shop_id) => {
  try {
    const url = `${ghnBaseUrl}/v2/shipping-order/detail`;
    const response = await axios.post(
      url,
      { order_code },
      { headers: buildHeaders(token, shop_id) }
    );
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (getOrderInfo):", errData);
    throw new Error(errData);
  }
};

const updateOrder = async (updateData, token, shop_id) => {
  try {
    const url = `${ghnBaseUrl}/v2/shipping-order/update`;
    const response = await axios.post(url, updateData, {
      headers: buildHeaders(token, shop_id),
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (updateOrder):", errData);
    throw new Error(errData);
  }
};

const cancelOrder = async (order_code, token, shop_id) => {
  try {
    const url = `${ghnBaseUrl}/v2/switch-status/cancel`;
    const response = await axios.post(
      url,
      { order_codes: [order_code] },
      { headers: buildHeaders(token, shop_id) }
    );
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (cancelOrder):", errData);
    throw new Error(errData);
  }
};

module.exports = {
  createOrder,
  getOrderInfo,
  updateOrder,
  cancelOrder,
};
