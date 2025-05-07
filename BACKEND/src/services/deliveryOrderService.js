const axios = require("axios");
const ghnBaseUrl = process.env.GHN_URL_DEVELOPMENT;
const db = require("../models/index");
const DeliveryOrder = db.DeliveryOrder;
const { getCache, setCache, deleteCache } = require("../utils/cache");

const buildHeaders = (token, shop_id) => ({
  "Content-Type": "application/json",
  Token: token,
  ShopId: shop_id,
});

const getDeliveryOrderInfo = async (order_code, token, shop_id) => {
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

const createDeliveryOrder = async (shipmentData, token, shop_id, seller_id) => {
  try {
    const url = `${ghnBaseUrl}/v2/shipping-order/create`;
    const response = await axios.post(url, shipmentData, {
      headers: buildHeaders(token, shop_id),
    });

    const data = response.data.data;
    const total_fee = Number(data.total_fee) || 0;
    const cod_amount = Number(shipmentData.cod_amount) || 0;
    const total_amount = total_fee + cod_amount;
    const orderInfo = await getDeliveryOrderInfo(
      data.order_code,
      token,
      shop_id
    );

    await DeliveryOrder.create({
      seller_id,
      order_code: data.order_code,
      status: orderInfo.data.status,
      to_name: shipmentData.to_name,
      to_phone: shipmentData.to_phone,
      to_address: shipmentData.to_address,
      is_printed: false,
      created_date: orderInfo.data.created_date,
      cod_amount: cod_amount,
      weight: shipmentData.weight,
      payment_type_id: shipmentData.payment_type_id,
      total_amount: total_amount,
    });
    await deleteCache(`delivery:orders:seller:${seller_id}`);
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (createOrder):", errData);
    throw new Error(errData);
  }
};

const updateDeliveryOrder = async (updateData, token, shop_id, seller_id) => {
  try {
    const url = `${ghnBaseUrl}/v2/shipping-order/update`;
    const response = await axios.post(url, updateData, {
      headers: buildHeaders(token, shop_id),
    });

    const orderInfo = await getDeliveryOrderInfo(
      updateData.order_code,
      token,
      shop_id
    );

    const total_fee = Number(orderInfo.data.total_fee) || 0;
    const cod_amount = Number(orderInfo.data.cod_amount) || 0;
    const total_amount = total_fee + cod_amount;

    await DeliveryOrder.update(
      {
        status: orderInfo.data.status,
        total_amount,
        cod_amount,
        to_name: updateData.to_name,
        to_phone: updateData.to_phone,
        to_address: updateData.to_address,
        weight: updateData.weight,
        payment_type_id: updateData.payment_type_id,
      },
      { where: { order_code: updateData.order_code } }
    );

    if (seller_id) {
      await deleteCache(`delivery:orders:seller:${seller_id}`);
    }

    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (updateOrder):", errData);
    throw new Error(errData);
  }
};

const cancelDeliveryOrder = async (order_code, token, shop_id, seller_id) => {
  try {
    const url = `${ghnBaseUrl}/v2/switch-status/cancel`;
    const response = await axios.post(
      url,
      { order_codes: [order_code] },
      { headers: buildHeaders(token, shop_id) }
    );

    await DeliveryOrder.update(
      { status: "cancel" },
      { where: { order_code } }
    );

    if (seller_id) {
      await deleteCache(`delivery:orders:seller:${seller_id}`);
    }

    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (cancelOrder):", errData);
    throw new Error(errData);
  }
};

const getAllDeliveryOrders = async () => {
  try {
    return await DeliveryOrder.findAll();
  } catch (err) {
    console.error("DB Error (getAllOrders):", err);
    throw err;
  }
};

const getDeliveryOrdersBySeller = async (seller_id) => {
  try {
    const cacheKey = `delivery:orders:seller:${seller_id}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      console.log("Cache hit for delivery orders of seller", seller_id);
      return cached;
    }

    const orders = await DeliveryOrder.findAll({
      where: { seller_id: seller_id },
    });

    await setCache(cacheKey, orders, 60 * 60); // TTL 1h
    return orders;
  } catch (err) {
    console.error("DB Error (getOrdersBySeller):", err);
    throw err;
  }
};

module.exports = {
  createDeliveryOrder,
  getDeliveryOrderInfo,
  getAllDeliveryOrders,
  updateDeliveryOrder,
  cancelDeliveryOrder,
  getDeliveryOrdersBySeller,
};
