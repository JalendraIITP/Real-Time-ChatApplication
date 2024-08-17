import express from "express";
import messageControllers from "../controllers/messageControllers.js"
import authMiddleware from "../middleware/authMiddleware.js"
const {
  allMessages,
  sendMessage,
} = messageControllers;
const { protect } = authMiddleware;

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

export default router
