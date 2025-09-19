import React, { useEffect, useState } from "react";
import "./AddressManager.css";
import { toast } from "react-hot-toast";
import AddressForm from "../AddressForm/AddressForm";
import { getAddresses, deleteAddress } from "../../lib/api";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();

      if (res?.success) {
        setAddresses(res.addresses || []);
      } else {
        toast.error(res?.message || "Failed to load addresses");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await deleteAddress(addressId);

      if (res?.success) {
        setAddresses(res.addresses || []);
        toast.success("Address deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete address");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete address");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleAddressUpdate = (updatedAddresses) => {
    setAddresses(updatedAddresses || []);
    handleFormClose();
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) return <div className="loading">Loading addresses...</div>;

  return (
    <div className="address-manager">
      <div className="address-header">
        <h3>My Addresses</h3>
        <button className="add-address-btn" onClick={handleAddAddress}>
          + Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="no-addresses">
          <p>No addresses found. Add your first address to get started!</p>
          <button className="add-first-btn" onClick={handleAddAddress}>
            Add Address
          </button>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`address-card ${address.isDefault ? "default" : ""}`}
            >
              {address.isDefault && <div className="default-badge">Default</div>}
              <div className="address-info">
                {address.userName && (
                  <h3 className="user-name">👤 {address.userName}</h3>
                )}
                <p className="address-text">
                  {address.name}, {address.street} <br />
                  {address.city}, {address.state} <br />
                  {address.pincode}
                </p>
                <p className="phone">Phone: {address.phone}</p>
              </div>
              <div className="address-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditAddress(address)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAddress(address._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddressForm
          address={editingAddress}
          onClose={handleFormClose}
          onAddressUpdate={handleAddressUpdate}
        />
      )}
    </div>
  );
};

export default AddressManager;