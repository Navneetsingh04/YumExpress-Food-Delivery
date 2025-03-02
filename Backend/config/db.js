import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://navneetsingh1825:Navneet1825@cluster0.gfbc6.mongodb.net/food-delivery?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => console.log("DB connected"));
};
