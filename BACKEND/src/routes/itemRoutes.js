import express from "express";
const itemController =  require("../controllers/itemController"); 

const router = express.Router();

router.post("/upload/:user_id", itemController.handleUploadItem);
router.get("/", itemController.handleGetAllItems);
router.get("/users/:user_id", itemController.handleGetItemByIdUser);//just for customers NOT USER
router.get("/:id", itemController.handleGetItemByIdItem);
router.put("/:id", itemController.handleUpdateItem);
router.delete("/:id", itemController.handleDeleteItem);
router.post("/purchase/:item_id",itemController.handlePurchaseItem)
export default router;
