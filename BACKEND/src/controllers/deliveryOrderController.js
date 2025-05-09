const deliveryOrderService = require("../services/deliveryOrderService");

const getHeadersFromRequest = (req) => {
  const token = req.headers["token"];
  const shop_id = req.headers["shop_id"];

  if (!token && !shop_id) {
    throw new Error("Missing GHN Token or ShopId in headers");
  }

  return { token, shop_id };
};

const handlePreviewOrderWithoutOrderCode = async (req, res) => {
  try {
    const { token, shop_id } = getHeadersFromRequest(req);
    const shipmentData = req.body;
    const data = await deliveryOrderService.previewOrderWithoutOrderCode(
      shipmentData,
      token,
      shop_id
    );
    return res.success("Preview order success", data);
  } catch (error) {
    return res.error(500, "Failed to preview order", error.message);
  }
};

const handleGetAllProvinces = async (req, res) => {
  try {
    const { token } = getHeadersFromRequest(req);
    const data = await deliveryOrderService.getAllProvinces(token);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const handleGetAllDistrictsByProvince = async (req, res) => {
  try {
    const { token } = getHeadersFromRequest(req);
    const { province_id } = req.body;
    if (!province_id) {
      return res.status(400).json({ message: "province_id is required" });
    }

    const data = await deliveryOrderService.getAllDistrictsByProvince(
      token,
      province_id
    );
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const handleGetAllWardsByDistrict = async (req, res) => {
  try {
    const { token } = getHeadersFromRequest(req);
    const { district_id } = req.query;

    if (!district_id) {
      return res.status(400).json({ message: "district_id is required" });
    }

    const data = await deliveryOrderService.getWardsByDistrict(
      token,
      district_id
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const handleCreateDeliveryOrder = async (req, res) => {
  try {
    const { token, shop_id } = getHeadersFromRequest(req);
    const shipmentData = req.body;
    const seller_id = req.user.id;
    const data = await deliveryOrderService.createDeliveryOrder(
      shipmentData,
      token,
      shop_id,
      seller_id
    );
    return res.success("Create order success", data);
  } catch (error) {
    return res.error(500, "Failed to create order", error.message);
  }
};

const handleGetDeliveryOrderInfo = async (req, res) => {
  try {
    const { token, shop_id } = getHeadersFromRequest(req);
    const { order_code } = req.params;

    const data = await deliveryOrderService.getDeliveryOrderInfo(
      order_code,
      token,
      shop_id
    );
    return res.success("Get order info success", data);
  } catch (error) {
    return res.error(500, "Failed to get order info", error.message);
  }
};

const handleUpdateDeliveryOrder = async (req, res) => {
  try {
    const { token, shop_id } = getHeadersFromRequest(req);
    const updateData = req.body;
    const data = await deliveryOrderService.updateDeliveryOrder(
      updateData,
      token,
      shop_id
    );
    return res.success("Update order success", data);
  } catch (error) {
    return res.error(500, "Failed to update order", error.message);
  }
};

const handleCancelDeliveryOrder = async (req, res) => {
  try {
    const { token, shop_id } = getHeadersFromRequest(req);
    const { order_code } = req.params;

    const data = await deliveryOrderService.cancelDeliveryOrder(
      order_code,
      token,
      shop_id
    );
    return res.success("Cancel order success", data);
  } catch (error) {
    return res.error(500, "Failed to cancel order", error.message);
  }
};

const handleGetAllDeliveryOrdersBySeller = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const orders = await deliveryOrderService.getDeliveryOrdersBySeller(
      sellerId
    );
    return res.success("Get all delivery orders by sellerId success", orders);
  } catch (error) {
    return res.error(
      500,
      "Get all delivery orders by sellerId failed",
      error.message
    );
  }
};

const handleGetAllDeliveryOrdersByBuyer = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const orders = await deliveryOrderService.getDeliveryOrdersByBuyer(buyerId);
    return res.success("Get all delivery orders by buyerId success", orders);
  } catch (error) {
    return res.error(
      500,
      "Get all delivery orders by buyerId failed",
      error.message
    );
  }
};

const handleGetAllDeliveryOrders = async (req, res) => {
  try {
    const orders = await deliveryOrderService.getAllDeliveryOrders();
    return res.success("Get all delivery orders success", orders);
  } catch (error) {
    return res.error(500, "Get all delivery orders failed", error.message);
  }
};

const handleGetAllDeliveryOrdersByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const orders = await deliveryOrderService.getAllDeliveryOrdersByStatus(
      status
    );
    return res.success("Get all delivery orders success", orders);
  } catch (error) {
    return res.error(500, "Get all delivery orders failed", error.message);
  }
};
module.exports = {
  handleCreateDeliveryOrder,
  handleGetDeliveryOrderInfo,
  handleCancelDeliveryOrder,
  handleUpdateDeliveryOrder,
  handleGetAllDeliveryOrdersBySeller,
  handleGetAllDeliveryOrders,
  handleGetAllProvinces,
  handleGetAllDistrictsByProvince,
  handleGetAllWardsByDistrict,
  handlePreviewOrderWithoutOrderCode,
  handleGetAllDeliveryOrdersByBuyer,
  handleGetAllDeliveryOrdersByStatus,
};
