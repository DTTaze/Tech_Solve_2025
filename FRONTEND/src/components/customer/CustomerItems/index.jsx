import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ItemFilters from "./ItemFilters";
import ItemTable from "./ItemTable";
import ItemDialog from "./ItemDialog";
import {
  getItemByIdUserApi,
  upLoadItemApi,
  updateItemOfCustomerApi,
  deleteItemOfCustomerApi,
  getUserApi,
} from "../../../utils/api";

const CustomerItems = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    minPrice: "",
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo?.id) {
      fetchItems();
    }
  }, [userInfo]);

  useEffect(() => {
    filterItems();
  }, [items, filters]);

  const fetchUserInfo = async () => {
    try {
      const response = await getUserApi();
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError("Failed to fetch user information. Please try again later.");
    }
  };

  const fetchItems = async () => {
    if (!userInfo?.id) return;

    try {
      setLoading(true);
      const response = await getItemByIdUserApi(userInfo.id);
      if (response.data) {
        setItems(response.data);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch items. Please try again later.");
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let result = [...items];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== "all") {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.minPrice) {
      result = result.filter((item) => item.price >= Number(filters.minPrice));
    }

    setFilteredItems(result);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      minPrice: "",
    });
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItemOfCustomerApi(itemId);
      await fetchItems(); // Refresh the items list after deletion
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleSaveItem = async (formData, images) => {
    try {
      if (selectedItem) {
        // Update existing item
        const response = await updateItemOfCustomerApi(
          selectedItem.id,
          formData,
          images
        );
        if (response.data) {
          await fetchItems(); // Refresh the items list after update
        }
      } else {
        // Create new item
        const response = await upLoadItemApi(formData, images);
        if (response.data) {
          await fetchItems(); // Refresh the items list after creation
        }
      }
      setOpenDialog(false);
    } catch (err) {
      console.error("Error saving item:", err);
      alert("Failed to save item. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading items...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          onClick={fetchItems}
          sx={{ mt: 2 }}
          className="customer-button"
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          My Items
        </Typography>
        <Button
          className="customer-button"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
        >
          Add Item
        </Button>
      </Box>

      <ItemFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <ItemTable
        items={filteredItems}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onAdd={handleAddItem}
      />

      <ItemDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveItem}
        item={selectedItem}
      />
    </Box>
  );
};

export default CustomerItems;
