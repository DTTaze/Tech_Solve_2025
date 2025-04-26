const { Worker } = require("bullmq");
const redis = require("../config/configRedis");
const db = require("../models/index");
const Item = db.Item;
const User = db.User;
const Transaction = db.Transaction;
const Inventory = db.Inventory;
const { generateCode } = require("../utils/generateCode");
const crypto = require("crypto");
require("dotenv").config();

const generateEncodeItem = async (item_info, user_info, quantity) => {
  const timestamp = Date.now();

  const dataToEncode = {
    item: {
      public_id: item_info.public_id,
      creator_id: item_info.creator_id,
      name: item_info.name,
      description: item_info.description,
      price: item_info.price,
      quantity: quantity,
      timestamp: timestamp
    },
    user: {
      public_id: user_info.public_id,
      google_id: user_info.google_id,
      email: user_info.email,
      username: user_info.username,
      full_name: user_info.full_name,
      phone_number: user_info.phone_number,
      address: user_info.address,
      timestamp: timestamp
    }
  };

  const jsonString = JSON.stringify(dataToEncode);

  const secretKey = process.env.ENCODE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("ENCODE_SECRET_KEY is not set");
  }

  const hash = crypto.createHmac("sha256", secretKey)
    .update(jsonString)
    .digest("hex");

  const finalCode = `${hash.substring(0, 16)}-${timestamp.toString(36)}`;

  return finalCode;
};

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
      status: item.stock - quantity === 0 ? "sold_out" : "available",
    });

    let uniqueCode, exists;
    do {
      uniqueCode = generateCode();
      exists = await Transaction.findByPk(uniqueCode);
    } while (exists !== null);

    const transaction = await Transaction.create({
      public_id: uniqueCode,
      name,
      buyer_id: user.id,
      item_id: item.id,
      quantity,
      total_price: item.price * quantity,
      status: "pending",
    });

    const encodeItem = await generateEncodeItem(item, user, quantity);

    Inventory.create({
      user_id: user.id,
      item_encode: encodeItem,
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
