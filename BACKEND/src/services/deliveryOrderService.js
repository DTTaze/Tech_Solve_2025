const axios = require("axios");
const ghnBaseUrl = process.env.GHN_URL_DEVELOPMENT;
const db = require("../models/index");
const DeliveryOrder = db.DeliveryOrder;
const Transaction = db.Transaction;
const ReceiverInformation = db.ReceiverInformation;
const { getCache, setCache, deleteCache } = require("../utils/cache");

const buildHeaders = (token, shop_id) => ({
  "Content-Type": "application/json",
  Token: token,
  ShopId: shop_id,
});

const getAllProvinces = async (token) => {
  try {
    const url = `${ghnBaseUrl}/master-data/province`;
    const response = await axios.get(url, { headers: buildHeaders(token) });
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (getProvince):", errData);
    throw new Error(JSON.stringify(errData));
  }
};

const getAllDistrictsByProvince = async (token, province_id) => {
  try {
    const url = `${ghnBaseUrl}/master-data/district`;

    const response = await axios.post(
      url,
      { province_id },
      { headers: buildHeaders(token) }
    );
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.log("error", error);

    console.error("GHN API Error (getDistrictByProvince):", errData);
    throw new Error(JSON.stringify(errData));
  }
};

const getWardsByDistrict = async (token, district_id) => {
  try {
    const url = `${ghnBaseUrl}/master-data/ward?district_id=${district_id}`;
    const response = await axios.get(url, { headers: buildHeaders(token) });
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (getWardsByDistrict):", errData);
    throw new Error(JSON.stringify(errData));
  }
};

const previewOrderWithoutOrderCode = async (data, token, shop_id) => {
  try {
    const url = `${ghnBaseUrl}/v2/shipping-order/preview`;
    const response = await axios.post(url, data, {
      headers: buildHeaders(token, shop_id),
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (previewOrderWithoutOrderCode):", errData);
    throw new Error(JSON.stringify(errData));
  }
};

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
    throw new Error(JSON.stringify(errData));
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
      seller_id: seller_id,
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
    console.error("GHN API Error (copyOrder):", errData);
    throw new Error(JSON.stringify(errData));
  }
};

const createDeliveryOrderFromTransaction = async (
  transaction_id,
  token,
  shop_id,
  seller_id,
  orderData
) => {
  try {
    const { payment_type_id, required_note, weight } = orderData;
    if (
      !transaction_id ||
      !seller_id ||
      !payment_type_id ||
      !required_note ||
      !weight
    ) {
      throw new Error("Missing parameters");
    }
    if (weight <= 0) {
      throw new Error("Weight must be positive");
    }
    const transaction = await Transaction.findByPk(transaction_id, {
      include: [
        {
          model: ReceiverInformation,
          as: "receiver_information",
        },
      ],
    });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    if (transaction.status !== "accepted") {
      throw new Error("Transaction was not accepted");
    }
    if (!transaction.receiver_information) {
      throw new Error("Receiver information not found");
    }
    const tempShipmentData = {
      to_name: transaction.receiver_information.to_name,
      to_phone: transaction.receiver_information.to_phone,
      to_address: transaction.receiver_information.to_address,
      to_ward_name: transaction.receiver_information.to_ward_name,
      to_district_name: transaction.receiver_information.to_district_name,
      to_province_name: transaction.receiver_information.to_province_name,
      service_type_id: 2,
      payment_type_id: payment_type_id,
      required_note: required_note,
      weight: weight,
    };
    const shipmentData = {
      ...orderData,
      ...tempShipmentData,
    };
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
      seller_id: transaction.seller_id,
      buyer_id: transaction.buyer_id,
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
    throw new Error(JSON.stringify(errData));
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
    throw new Error(JSON.stringify(errData));
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

    await DeliveryOrder.update({ status: "cancel" }, { where: { order_code } });

    if (seller_id) {
      await deleteCache(`delivery:orders:seller:${seller_id}`);
    }

    return response.data;
  } catch (error) {
    const errData = error.response?.data?.code_message_value || {
      message: error.message,
    };
    console.error("GHN API Error (cancelOrder):", errData);
    throw new Error(JSON.stringify(errData));
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

const getAllDeliveryOrdersByStatus = async (status) => {
  if (!status || typeof status !== "string") {
    throw new Error("Invalid status parameter");
  }

  try {
    const orders = await DeliveryOrder.findAll({ where: { status } });
    return orders;
  } catch (error) {
    console.error(
      `Error fetching delivery orders with status ${status}:`,
      error
    );
    throw new Error(`Failed to fetch delivery orders: ${error.message}`);
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

const getDeliveryOrdersByBuyer = async (buyer_id) => {
  try {
    const cacheKey = `delivery:orders:buyer:${buyer_id}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      console.log("Cache hit for delivery orders of buyer", buyer_id);
      return cached;
    }

    const orders = await DeliveryOrder.findAll({
      where: { buyer_id: buyer_id },
    });

    await setCache(cacheKey, orders, 60 * 60); // TTL 1h
    return orders;
  } catch (err) {
    console.error("DB Error (getOrdersByBuyer):", err);
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
  getAllProvinces,
  getAllDistrictsByProvince,
  getWardsByDistrict,
  previewOrderWithoutOrderCode,
  getDeliveryOrdersByBuyer,
  getAllDeliveryOrdersByStatus,
  createDeliveryOrderFromTransaction,
};
