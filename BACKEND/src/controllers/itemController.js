const itemService = require('../services/itemService');

const handleUploadItem = async (req, res) => {
    const idUser = req.params.idUser;
    const itemData = req.body;
    const item = await itemService.createItem(itemData,idUser);
    return res.success("Item uploaded successfully", item);
}

const handlegetAllItems = async (req, res) => {
    const items = await itemService.getAllItems();
    return res.success("Items retrieved successfully", items);
}

const handleGetItemByIdItem = async (req, res) => {
    const idItem = req.params.idItem;
    const item = await itemService.getItemByIdItem(idItem);
    return res.success("Item retrieved successfully", item);
}

const handleGetItemByIdUser = async (req, res) => {
    const idUser = req.params.idUser;
    const item = await itemService.getItemByIdUser(idUser);
    return res.success("Item retrieved successfully", item);
}

const handleUpdateItem = async (req, res) => {
    const idItem = req.params.idItem;
    const itemData = req.body;
    const item = await itemService.updateItem(idItem, itemData);
    return res.success("Item updated successfully", item);
}

const handleDeleteItem = async (req, res) => {
    const idItem = req.params.idItem;
    const message = await itemService.deleteItem(idItem);
    return res.success(message);
}

module.exports = { 
    handleUploadItem,
    handlegetAllItems,
    handleGetItemByIdItem,
    handleGetItemByIdUser,
    handleUpdateItem,
    handleDeleteItem
}