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
router.get(
  "/carrier/ghn/orders",
  deliveryOrderController.handleGetAllDeliveryOrders
);
router.get(
  "/carrier/ghn/orders/user",
  deliveryOrderController.handleGetAllDeliveryOrdersBySeller
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
router.post("/accounts/", deliveryAccountController.handleCreateDeliveryAccount);
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
