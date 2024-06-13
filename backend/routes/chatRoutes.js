const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chatControllers");


const router = express.Router();

router.route('/').post(protect,accessChat);
router.route('/').get(protect,fetchChats);

router.route('/group').post(protect,createGroupChat);
router.route('/renameGroup').put(protect,renameGroup);
router.route('/removeFromGroup').put(protect,removeFromGroup);
router.route('/addToGroup').put(protect,addToGroup);

module.exports = router;