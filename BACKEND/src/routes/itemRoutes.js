import express from "express";
const itemController =  require("../controllers/itemController"); 

const router = express.Router();

router.post("/upload/:idUser", itemController.handleUploadItem);
router.get("/", itemController.handlegetAllItems);
router.get("/:idItem", itemController.handleGetItemByIdItem);
router.get("/user/:idUser", itemController.handleGetItemByIdUser);
router.put("/:idItem", itemController.handleUpdateItem);
router.delete("/:idItem", itemController.handleDeleteItem);

export default router;
