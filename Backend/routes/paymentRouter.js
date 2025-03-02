import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  paymentOrder,
  paymentVerification,
  razorpayKeyId,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.get("/get-razorpay-key-id", authMiddleware, razorpayKeyId);
paymentRouter.post("/verify", authMiddleware, paymentVerification);
paymentRouter.post("/order", authMiddleware, paymentOrder);

export default paymentRouter;
