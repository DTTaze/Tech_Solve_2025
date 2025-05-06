const express = require('express');
const router = express.Router();
const identifyController = require("../controllers/identifyController");
const multer = require('multer');
// Store uploaded image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get(
    '/trash',
    upload.single('images'),
    identifyController.handleIdentifyImage
);

module.exports = router;
