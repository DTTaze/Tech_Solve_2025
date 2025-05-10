const cron = require("node-cron");
const db = require("../models");
const DeliveryOrder = db.DeliveryOrder;
const DeliveryAccount = db.DeliveryAccount;
const orderSyncQueue = require("../queues/orderSyncQueue");

const ACTIVE_STATUSES = [
  "ready_to_pick",
  "picking",
  "money_collect_picking",
  "picked",
  "storing",
  "transporting",
  "sorting",
  "delivering",
  "money_collect_delivering",
  "waiting_to_return",
  "return",
  "return_transporting",
  "return_sorting",
  "returning",
  "exception",
  "lost",
  "damage",
];

cron.schedule("*/2 * * * *", async () => {
  try {
    const pendingOrders = await DeliveryOrder.findAll({
      where: {
        status: ACTIVE_STATUSES,
      },
      include: [
        {
          model: DeliveryAccount,
          as: "delivery_account",
          attributes: ["shop_id", "token"],
        },
      ],
    });
    for (const order of pendingOrders) {
      await orderSyncQueue.add("syncOrderStatus", {
        orderCode: order.order_code,
        deliveryAccountId: order.delivery_account.dataValues,
      });
    }

    console.log(`🕒 Queued ${pendingOrders.length} orders for GHN sync`);
  } catch (err) {
    console.error("❌ Error queuing GHN sync jobs:", err);
  }
});
