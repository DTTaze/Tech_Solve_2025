const ghnService = require("../services/ghnService");

const handleCreateOrder = async (req, res) => {
  try {
    const shipmentData = req.body;
    const data = await ghnService.createOrder(shipmentData);
    return res.success("Create order success", data);
  } catch (error) {
    return res.error(500, "Failed to create order", error.message);
  }
};
const handleGetOrderInfo = async (req, res) => {
  try {
    const { order_code } = req.params;
    const data = await ghnService.getOrderInfo(order_code);
    return res.success("Get order info success", data);
  } catch (error) {
    return res.error(500, "Failed to get order info", error.message);
  }
};

const handleUpdateOrder = async (req, res) => {
  try {
    const data = await ghnService.updateOrder(req.body);
    return res.success("Update order success", data);
  } catch (error) {
    return res.error(500, "Failed to update order", error.message);
  }
};

const handleCancelOrder = async (req, res) => {
  try {
    const { order_code } = req.params;
    const data = await ghnService.cancelOrder(order_code);
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
