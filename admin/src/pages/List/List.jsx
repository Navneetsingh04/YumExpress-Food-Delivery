import React, { useEffect, useState } from "react";
import "./List.css";
import { fetchFoods, removeFood } from "../../lib/api";
import { toast } from "react-hot-toast";

const List = () => {
  const [list, setList] = useState([]);

  const loadList = async () => {
    const response = await fetchFoods();
    if (response.success) {
      setList(response.data);
    } else {
      toast.error(response.message || "Failed to fetch foods");
    }
  };

  const handleRemove = async (foodId) => {
    const result = await removeFood(foodId);
    if (result.success) {
      loadList();
    } else {
      toast.error(result.message);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img
              src={item.image} 
              alt={item.name || "Food Image"}
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p
              onClick={() => handleRemove(item._id)}
              className="cursor"
              style={{ color: "red", fontWeight: "bold" }}
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
