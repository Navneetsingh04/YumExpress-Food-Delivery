import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuthMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.json({ success: false, message: "Not Authorized - Admin Login Required" });
  }
  
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(token_decode.id).select('role');
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    if (user.role !== 'admin') {
      return res.json({ success: false, message: "Admin access required" });
    }
    
    req.body.userId = token_decode.id;
    req.body.userRole = user.role;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.json({ success: false, message: "Invalid admin token" });
  }
};

export default adminAuthMiddleware;