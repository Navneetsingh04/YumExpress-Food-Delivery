import cloudinary from "../config/cloudinary.js";
import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item

const addFood = async (req, res) => {
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: req.body.imageUrl,
    publicId: req.body.publicId,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error in adding Food iteam" });
  }
};

//  all food list

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// remove food items

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    
    if(food.publicId){
      await cloudinary.uploader.destroy(food.publicId);
    }

    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food Removed Successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
