const { Worker } = require("bullmq");
const redis = require("../config/configRedis");
const { Item, User, Transaction } = require("../models");
const { generateCode } = require("../utils/generateCode");

const worker = new Worker(
  "purchase",
  async (job) => {
    const { user_id, item_id, quantity, name } = job.data;

    const item = await Item.findByPk(item_id);
    if (!item || item.status !== "available" || item.stock < quantity) {
      throw new Error("Item not available or insufficient stock");
    }

    const user = await User.findByPk(user_id);
    if (!user || user.coins < item.price * quantity) {
      throw new Error("User not found or insufficient balance");
    }

    await user.update({ coins: user.coins - item.price * quantity });
    await item.update({
      stock: item.stock - quantity,
      status: item.stock - quantity === 0 ? "sold" : "available",
    });

    let uniqueCode, exists;
    do {
      uniqueCode = generateCode();
      exists = await Transaction.findByPk(uniqueCode);
    } while (exists !== null);

    const transaction = await Transaction.create({
      id: uniqueCode,
      name,
      buyer_id: user.id,
      item_id: item.id,
      quantity,
      total_price: item.price * quantity,
      status: "pending",
    });
    return transaction;
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});
