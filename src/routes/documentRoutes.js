const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  uploadDoc,
  verifyDoc,
  rejectDoc,
  getDocs,
} = require("../controllers/documentController");

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadDoc);
router.get("/", protect, getDocs);

router.put("/verify/:id", protect, authorize("manager"), verifyDoc);
router.put("/reject/:id", protect, authorize("admin"), rejectDoc);

module.exports = router;
