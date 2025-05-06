const ghnService = require("../services/ghnService");

const getHeadersFromRequest = (req) => {
  const token = req.headers["token"];
  const shop_id = req.headers["shop_id"];

  if (!token || !shop_id) {
    throw new Error("Missing GHN Token or ShopId in headers");
  }

  return { token, shop_id };
};

const handleCreateOrder = async (req, res) => {
  try {
    const { token, shop_id } = getHeadersFromRequest(req);
    const shipmentData = req.body;

    const data = await ghnService.createOrder(shipmentData, token, shop_id);
    return res.success("Create order success", data);
  } catch (error) {
    return res.error(500, "Failed to create order", error.message);
  }
};

const handleGetOrderInfo = async (req, res) => {
  try {
    const { token, shop_id } = getHeadersFromRequest(req);
    const { order_code } = req.params;

    const data = await ghnService.getOrderInfo(order_code, token, shop_id);
    return res.success("Get order info success", data);
  } catch (error) {
    return res.error(500, "Failed to get order info", error.message);
  }
};

const handleUpdateOrder = async (req, res) => {
  try {
    const { token, shop_id } = getHeadersFromRequest(req);

    const data = await ghnService.updateOrder(req.body, token, shop_id);
    return res.success("Update order success", data);
  } catch (error) {
    return res.error(500, "Failed to update order", error.message);
  }
};

const handleCancelOrder = async (req, res) => {
  try {
    const { token, shop_id } = getHeadersFromRequest(req);
    const { order_code } = req.params;

    const data = await ghnService.cancelOrder(order_code, token, shop_id);
    return res.success("Cancel order success", data);
  } catch (error) {
    return res.error(500, "Failed to cancel order", error.message);
  }
};

module.exports = {
  handleCreateOrder,
  handleGetOrderInfo,
  handleCancelOrder,
  handleUpdateOrder,
};
