const itemService = require("../services/itemService");

const handleUploadItem = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    const itemData = req.body;
    const item = await itemService.createItem(itemData, user_id);
    return res.success("Item uploaded successfully", item);
  } catch (error) {
    return res.error(500, "Failed to upload item", error.message);
  }
};

const handleGetAllItems = async (req, res) => {
  try {
    const items = await itemService.getAllItems();
    return res.success("Items retrieved successfully", items);
  } catch (error) {
    return res.error(500, "Failed to fetch items", error.message);
  }
};

const handleGetItemByIdItem = async (req, res) => {
  try {
    const item_id = Number(req.params.id);
    const item = await itemService.getItemByIdItem(item_id);
    return res.success("Item retrieved successfully", item);
  } catch (error) {
    return res.error(500, "Failed to fetch item", error.message);
  }
};

const handleGetItemByIdUser = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    const items = await itemService.getItemByIdUser(user_id);
    return res.success("Items retrieved successfully", items);
  } catch (error) {
    return res.error(500, "Failed to fetch items", error.message);
  }
};

const handleUpdateItem = async (req, res) => {
  try {
    const item_id = Number(req.params.id);
    const itemData = req.body;
    const updatedItem = await itemService.updateItem(item_id, itemData);
    return res.success("Item updated successfully", updatedItem);
  } catch (error) {
    return res.error(500, "Failed to update item", error.message);
  }
};

const handleDeleteItem = async (req, res) => {
  try {
    const item_id = Number(req.params.id);
    const message = await itemService.deleteItem(item_id);
    return res.success("Item deleted successfully", message);
  } catch (error) {
    return res.error(500, "Failed to delete item", error.message);
  }
};
const handlePurchaseItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_coin_id = req.user.coins_id;
    const item_id = Number(req.params.item_id);
    const data = req.body;
    const result = await itemService.purchaseItem(user_id,user_coin_id ,item_id, data);
    return res.success("Item purchased successfully", result);
  } catch (error) {
    return res.error(500, "Failed to purchase item", error.message);
  }
};
const handlePurchaseQueue = async (req, res) => {
  try {
    const user_id = req.user.id;
    const item_id = Number(req.params.item_id);
    const data = req.body;
    const result = await itemService.requestPurchase(user_id, item_id, data);
    return res.success("Item purchased successfully", result);
  } catch (error) {
    return res.error(500, "Failed to purchase item", error.message);
  }
};
module.exports = {
  handleUploadItem,
  handleGetAllItems,
  handleGetItemByIdItem,
  handleGetItemByIdUser,
  handleUpdateItem,
  handleDeleteItem,
  handlePurchaseItem,
  handlePurchaseQueue,
};
