const express = require("express");
const itemController =  require("../controllers/itemController"); 
const middlewareImage = require("../middlewares/middlewareImage");

const router = express.Router();

router.post("/upload/:user_id", middlewareImage.array("images", 5), itemController.handleUploadItem);
router.get("/", itemController.handleGetAllItems);
router.get("/users/:user_id", itemController.handleGetItemByIdUser);
router.get("/:id", itemController.handleGetItemByIdItem);
router.put("/:id", itemController.handleUpdateItem);
router.delete("/:id", itemController.handleDeleteItem);
router.post("/purchase/:item_id",itemController.handlePurchaseItem)
module.exports = router;
