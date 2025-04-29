const { createBullBoard } = require("@bull-board/api");
const { ExpressAdapter } = require("@bull-board/express");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const purchaseQueue = require("./queue");

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/api/admin/queues");

const { addQueue, removeQueue, setQueues } = createBullBoard({
  queues: [new BullMQAdapter(purchaseQueue)],
  serverAdapter: serverAdapter,
});
module.exports = serverAdapter;
