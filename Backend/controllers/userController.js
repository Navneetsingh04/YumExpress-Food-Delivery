import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

// Function to create JWT token
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // Check if user exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email & password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid Email ID",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    return res.json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    return res.json({ success: true, token }); 
  } catch (error) {
    return res.json({ success: false, message: "Error!" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select('-password');
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: "Error fetching user profile" });
  }
};

// Add new address
const addAddress = async (req, res) => {
  try {
    const { name, userName, street, city, state, pincode, phone, isDefault } = req.body;
    const userId = req.body.userId;

    if (!name || !userName || !street || !city || !state || !pincode || !phone) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // If this is set as default, make all other addresses non-default
    if (isDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    // Add new address
    const newAddress = {
      name,
      userName,
      street,
      city,
      state,
      pincode,
      phone,
      isDefault: isDefault || user.addresses.length === 0
    };

    user.addresses.push(newAddress);
    await user.save();

    return res.json({ 
      success: true, 
      message: "Address added successfully",
      addresses: user.addresses 
    });
  } catch (error) {
    return res.json({ success: false, message: "Error adding address" });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { addressId, name, userName, street, city, state, pincode, phone, isDefault } = req.body;
    const userId = req.body.userId;

    ("Update address request:", req.body);

    if (!addressId || !name || !userName || !street || !city || !state || !pincode || !phone) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.json({ success: false, message: "Address not found" });
    }

    // If this is set as default, make all other addresses non-default
    if (isDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    // Update the address
    user.addresses[addressIndex] = {
      _id: user.addresses[addressIndex]._id,
      name,
      userName,
      street,
      city,
      state,
      pincode,
      phone,
      isDefault
    };

    await user.save();

    return res.json({ 
      success: true, 
      message: "Address updated successfully",
      addresses: user.addresses 
    });
  } catch (error) {
    return res.json({ success: false, message: "Error updating address" });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const userId = req.body.userId;

    if (!addressId) {
      return res.json({ success: false, message: "Address ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.json({ success: false, message: "Address not found" });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If the deleted address was default and there are other addresses, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return res.json({ 
      success: true, 
      message: "Address deleted successfully",
      addresses: user.addresses 
    });
  } catch (error) {
    return res.json({ success: false, message: "Error deleting address" });
  }
};

// Get all addresses
const getAddresses = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId).select('addresses');
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ 
      success: true, 
      addresses: user.addresses 
    });
  } catch (error) {
    return res.json({ success: false, message: "Error fetching addresses" });
  }
};

const adminLogin = async (req, res) => {
  const { email, password, adminSecretKey } = req.body;
  try {
    const requiredSecretKey = process.env.ADMIN_SECRET_KEY;
    if (adminSecretKey !== requiredSecretKey) {
      return res.json({ 
        success: false, 
        message: "Invalid admin secret key. Access denied." 
      });
    }

    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.json({ success: false, message: "Admin not found" });
    }
    
    if (user.role !== "admin") {
      return res.json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid admin credentials" });
    }

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: "Admin login successful"
    });
  } catch (error) {
    res.json({ success: false, message: "Error during admin login" });
  }
};

export { 
  loginUser, 
  registerUser, 
  getUserProfile, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  getAddresses,
  adminLogin
};
