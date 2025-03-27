import express from "express";
const itemController =  require("../controllers/itemController"); 

const router = express.Router();

router.post("/upload/:user_id", itemController.handleUploadItem);
router.get("/", itemController.handleGetAllItems);
router.get("/:item_id", itemController.handleGetItemByIdItem);
router.get("/users/:user_id", itemController.handleGetItemByIdUser);
router.put("/:item_id", itemController.handleUpdateItem);
router.delete("/:item_id", itemController.handleDeleteItem);

export default router;
