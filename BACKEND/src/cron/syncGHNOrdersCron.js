const cron = require("node-cron");
const db = require("../models");
const DeliveryOrder = db.DeliveryOrder;
const orderSyncQueue = require("../queues/orderSyncQueue");

const ACTIVE_STATUSES = [
  "ready_to_pick",
  "picking",
  "money_collect_picking",
  "transporting",
  "delivering",
  "money_collect_delivering",
];

cron.schedule("*/2 * * * *", async () => {
  try {
    const pendingOrders = await DeliveryOrder.findAll({
      where: {
        status: ACTIVE_STATUSES,
      },
    });

    for (const order of pendingOrders) {
      await orderSyncQueue.add("syncOrderStatus", {
        orderCode: order.order_code,
      });
    }

    console.log(`🕒 Queued ${pendingOrders.length} orders for GHN sync`);
  } catch (err) {
    console.error("❌ Error queuing GHN sync jobs:", err);
  }
});
