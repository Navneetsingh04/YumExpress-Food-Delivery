import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "./Add.css";
import { assets } from "../../assets/assets";
import categories from "../../data/categories.json";
import { addFood } from "../../lib/api";

const Add = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: categories[0] || "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      return toast.error("Please upload an image");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    const result = await addFood(formData);
    if (result.success) {
      toast.success(result.message);
      setData({
        name: "",
        description: "",
        price: "",
        category: categories[0],
      });
      setImage(null);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Image Upload */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : assets.upload_area
              }
              alt="Upload Preview"
            />
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Product Name */}
        <div className="add-product-name">
          <p>Product Name</p>
          <input
            type="text"
            name="name"
            placeholder="Type here"
            value={data.name}
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* Description */}
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            rows="6"
            placeholder="Write content here"
            value={data.description}
            onChange={onChangeHandler}
            required
          ></textarea>
        </div>

        {/* Category & Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              required
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              type="number"
              name="price"
              placeholder="₹100"
              value={data.price}
              onChange={onChangeHandler}
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;
