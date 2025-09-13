import express from "express";
import { 
  loginUser, 
  registerUser, 
  getUserProfile, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  getAddresses 
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.get("/addresses", authMiddleware, getAddresses);
userRouter.post("/addresses/add", authMiddleware, addAddress);
userRouter.put("/addresses/update", authMiddleware, updateAddress);
userRouter.delete("/addresses/delete", authMiddleware, deleteAddress);

export default userRouter;
