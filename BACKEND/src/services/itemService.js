const db = require('../models/index');
const Item = db.Item;
const User = db.User;
const Transaction = db.Transaction;

const createItem = async (itemData,idUser) => {
  try {
    if (!idUser|| !itemData.name || !itemData.price) {
      throw new Error("Missing required fields (owner_id, name, price)");
    }
    itemData.owner_id = idUser;
    if (itemData.price < 1) {
      throw new Error("Price must be at least 1");
    }

    const owner = await User.findByPk(itemData.owner_id);
    if (!owner) {
      throw new Error("Owner ID does not exist");
    }

    const newItem = await Item.create(itemData);
    return newItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllItems = async () => {
    try {
        const items = await Item.findAll();
        return items;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getItemByIdItem = async (idItem) => {
    try {
        const item = await Item.findByPk(idItem);
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getItemByIdUser = async (idUser) => {
    try {
        const items = await Item.findAll({
            where : {owner_id : idUser},
        });
        return items;
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateItem = async (id, itemData) => {
    try {
        const item = await Item.findByPk(id);
        if (!item) {
            throw new Error("Item not found");
        }
        if (itemData.price < 1) {
            throw new Error("Price must be at least 1");
        }
        itemData.owner_id = id;
        await item.update(itemData);
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteItem = async (idItem) => {
    try{
        const deleted = await Item.destroy({
            where : { id : idItem}
        });

        if (deleted){
            return {message: "Item deleted successfully"};
        }else {
            return { message: "Item not found" };
        }

    }catch (err){
        throw new Error(err.message);
    }
}

module.exports = {
    createItem,
    getAllItems,
    getItemByIdItem,
    getItemByIdUser,
    updateItem,
    deleteItem
}