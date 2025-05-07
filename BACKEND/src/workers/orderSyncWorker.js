// workers/orderSyncWorker.js
const { Worker } = require("bullmq");
const db = require("../models");
const { DeliveryOrder } = db;
const { redis } = require("../config/configRedis");
const { getDeliveryOrderInfo } = require("../services/deliveryOrderService");

const worker = new Worker(
  "orderSync",
  async (job) => {
    const { orderCode } = job.data;

    const apiRes = await getDeliveryOrderInfo(
      orderCode,
      process.env.GHN_TOKEN_DEVELOPMENT,
      process.env.GHN_SHOPID_DEVELOPMENT
    );
    console.log("check api res", apiRes);
    if (apiRes.message != "Success") {
      throw new Error("Failed to fetch GHN order detail");
    }

    const data = apiRes.data;

    const existing = await DeliveryOrder.findOne({
      where: { order_code: orderCode },
    });
    if (!existing) return;

    if (existing.status !== data.status) {
      await existing.update({
        status: data.status,
        to_name: data.to_name,
        to_phone: data.to_phone,
        to_address: data.to_address,
        cod_amount: data.cod_amount,
        weight: data.weight,
        total_amount: data.total_fee,
      });
    }

    return { updated: true, orderCode };
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log(`✅ Synced order: ${job.data.orderCode}`);
});

worker.on("failed", (job, err) => {
  console.error(
    `❌ Failed to sync ${job.data.orderCode}: ${JSON.stringify(err.message)}`
  );
});
