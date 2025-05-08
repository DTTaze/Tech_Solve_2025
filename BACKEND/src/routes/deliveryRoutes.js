const express = require("express");
const deliveryAccountController = require("../controllers/deliveryAccountController");
const deliveryOrderController = require("../controllers/deliveryOrderController");
const router = express.Router();

router.post(
  "/carrier/ghn/create-order",
  deliveryOrderController.handleCreateDeliveryOrder
);
router.get(
  "/carrier/ghn/detail/:order_code",
  deliveryOrderController.handleGetDeliveryOrderInfo
);
router.post(
  "/carrier/ghn/update",
  deliveryOrderController.handleUpdateDeliveryOrder
);
router.post(
  "/carrier/ghn/cancel/:order_code",
  deliveryOrderController.handleCancelDeliveryOrder
);
router.post(
  "/carrier/ghn/order/preview",
  deliveryOrderController.handlePreviewOrderWithoutOrderCode
);
router.get(
  "/carrier/ghn/orders",
  deliveryOrderController.handleGetAllDeliveryOrders
);
router.get(
  "/carrier/ghn/orders/user",
  deliveryOrderController.handleGetAllDeliveryOrdersBySeller
);
router.get(
  "/carrier/ghn/master-data/province",
  deliveryOrderController.handleGetAllProvinces
);
router.post(
  "/carrier/ghn/master-data/district",
  deliveryOrderController.handleGetAllDistrictsByProvince
);
router.get(
  "/carrier/ghn/master-data/ward",
  deliveryOrderController.handleGetAllWardsByDistrict
);

//manage shipping account
router.get(
  "/accounts/user",
  deliveryAccountController.handleGetAllDeliveryAccounts
);
router.get(
  "/accounts/:id",
  deliveryAccountController.handleGetDeliveryAccountById
);
router.post(
  "/accounts/create",
  deliveryAccountController.handleCreateDeliveryAccount
);
router.put(
  "/accounts/:id",
  deliveryAccountController.handleUpdateDeliveryAccount
);
router.delete(
  "/accounts/:id",
  deliveryAccountController.handleDeleteDeliveryAccount
);
router.patch(
  "/accounts/user/set-default/:id",
  deliveryAccountController.handleSetDefaultDeliveryAccount
);

module.exports = router;
