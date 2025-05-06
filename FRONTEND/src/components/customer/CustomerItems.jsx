import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Badge,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CategoryIcon from "@mui/icons-material/Category";
import WarningIcon from "@mui/icons-material/Warning";

// Sample data for items
const SAMPLE_ITEMS = [
  {
    id: 1,
    name: "Eco-friendly Water Bottle",
    description: "Reusable stainless steel water bottle, 24oz capacity",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "accessories",
    price: 20,
    stock: 45,
    rewardCost: 300,
    status: "in-stock",
  },
  {
    id: 2,
    name: "Organic Cotton Tote Bag",
    description: "100% organic cotton tote bag with eco-friendly print",
    image:
      "https://images.unsplash.com/photo-1605600659453-5499913057af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "accessories",
    price: 15,
    stock: 5,
    rewardCost: 200,
    status: "low-stock",
  },
  {
    id: 3,
    name: "Bamboo Utensil Set",
    description:
      "Portable bamboo utensil set including fork, knife, spoon and chopsticks",
    image:
      "https://images.unsplash.com/photo-1584346133934-5a3148161f8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "kitchen",
    price: 12,
    stock: 30,
    rewardCost: 150,
    status: "in-stock",
  },
  {
    id: 4,
    name: "Recycled Paper Notebook",
    description: "A5 notebook made from 100% recycled paper with 120 pages",
    image:
      "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "stationery",
    price: 8,
    stock: 0,
    rewardCost: 100,
    status: "out-of-stock",
  },
  {
    id: 5,
    name: "Solar Power Bank",
    description:
      "10000mAh solar power bank for eco-friendly charging on the go",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba53cbb7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    price: 35,
    stock: 20,
    rewardCost: 500,
    status: "in-stock",
  },
  {
    id: 6,
    name: "Bamboo Toothbrush",
    description:
      "Set of 4 biodegradable bamboo toothbrushes with charcoal bristles",
    image:
      "https://images.unsplash.com/photo-1607613013833-91efdd5ebdc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "bathroom",
    price: 10,
    stock: 50,
    rewardCost: 120,
    status: "in-stock",
  },
];

export default function CustomerItems() {
  const userInfo = useOutletContext();
  const [items, setItems] = useState(SAMPLE_ITEMS);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or table

  // Filter items based on search term and category
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (item = null) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleSaveItem = () => {
    // Here would go the logic to save the item to backend
    handleCloseDialog();
  };

  const handleDeleteItem = (id) => {
    // Here would go the logic to delete the item from backend
    setItems(items.filter((item) => item.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return "success";
      case "low-stock":
        return "warning";
      case "out-of-stock":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box className="customer-content-container">
      <Box className="customer-section">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Typography className="customer-section-title">
            Item Management
          </Typography>

          <Button
            className="customer-button"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Item
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search items..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: { md: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="accessories">Accessories</MenuItem>
                <MenuItem value="kitchen">Kitchen</MenuItem>
                <MenuItem value="stationery">Stationery</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="bathroom">Bathroom</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant={viewMode === "grid" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewMode("grid")}
                sx={{
                  backgroundColor:
                    viewMode === "grid"
                      ? "var(--primary-green)"
                      : "transparent",
                  borderColor: "var(--primary-green)",
                  color: viewMode === "grid" ? "white" : "var(--primary-green)",
                  "&:hover": {
                    backgroundColor:
                      viewMode === "grid"
                        ? "var(--dark-green)"
                        : "rgba(46, 125, 50, 0.08)",
                    borderColor: "var(--primary-green)",
                  },
                }}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewMode("table")}
                sx={{
                  backgroundColor:
                    viewMode === "table"
                      ? "var(--primary-green)"
                      : "transparent",
                  borderColor: "var(--primary-green)",
                  color:
                    viewMode === "table" ? "white" : "var(--primary-green)",
                  "&:hover": {
                    backgroundColor:
                      viewMode === "table"
                        ? "var(--dark-green)"
                        : "rgba(46, 125, 50, 0.08)",
                    borderColor: "var(--primary-green)",
                  },
                }}
              >
                Table
              </Button>
            </Box>
          </Box>
        </Box>

        {viewMode === "grid" ? (
          <Grid container spacing={3}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Badge
                      badgeContent={
                        item.status === "low-stock" ? (
                          <WarningIcon fontSize="small" />
                        ) : null
                      }
                      color="warning"
                      overlap="circular"
                      sx={{
                        "& .MuiBadge-badge": {
                          top: 12,
                          right: 12,
                          border: "2px solid white",
                          padding: "0 4px",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="160"
                        image={item.image}
                        alt={item.name}
                        sx={{
                          objectFit: "cover",
                          borderBottom: `1px solid var(--grey-200)`,
                        }}
                      />
                    </Badge>
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, fontSize: "1rem" }}
                        >
                          {item.name}
                        </Typography>
                        <Chip
                          label={item.status.replace("-", " ")}
                          size="small"
                          color={getStatusColor(item.status)}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          height: "40px",
                        }}
                      >
                        {item.description}
                      </Typography>

                      <Grid container spacing={1} sx={{ mb: 1 }}>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocalOfferIcon
                              fontSize="small"
                              sx={{ color: "var(--text-light)", mr: 0.5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <InventoryIcon
                              fontSize="small"
                              sx={{ color: "var(--text-light)", mr: 0.5 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Stock: {item.stock}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <CategoryIcon
                          fontSize="small"
                          sx={{ color: "var(--text-light)", mr: 0.5 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {item.category}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box
                      sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(item)}
                        sx={{ color: "var(--primary-green)" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(item.id)}
                        sx={{ color: "var(--error)" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 5,
                    backgroundColor: "var(--grey-100)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No items found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or add a new item
                  </Typography>
                  <Button
                    className="customer-button"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ mt: 2 }}
                  >
                    Add Item
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        ) : (
          <TableContainer component={Paper} className="customer-table">
            <Table sx={{ minWidth: 650 }} aria-label="items table">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Reward Cost</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {item.category}
                      </TableCell>
                      <TableCell align="right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">{item.stock}</TableCell>
                      <TableCell align="right">
                        {item.rewardCost} coins
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status.replace("-", " ")}
                          size="small"
                          color={getStatusColor(item.status)}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(item)}
                          sx={{ color: "var(--primary-green)" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteItem(item.id)}
                          sx={{ color: "var(--error)" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No items found. Try adjusting your filters or add a new
                        item.
                      </Typography>
                      <Button
                        className="customer-button"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ mt: 2 }}
                      >
                        Add Item
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Add/Edit Item Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{selectedItem ? "Edit Item" : "Add New Item"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Item Name"
                fullWidth
                variant="outlined"
                defaultValue={selectedItem?.name || ""}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                defaultValue={selectedItem?.description || ""}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price ($)"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={selectedItem?.price || ""}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock Quantity"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={selectedItem?.stock || ""}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Reward Cost (coins)"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={selectedItem?.rewardCost || ""}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  defaultValue={selectedItem?.category || "accessories"}
                >
                  <MenuItem value="accessories">Accessories</MenuItem>
                  <MenuItem value="kitchen">Kitchen</MenuItem>
                  <MenuItem value="stationery">Stationery</MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="bathroom">Bathroom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedItem?.status || "in-stock"}
                >
                  <MenuItem value="in-stock">In Stock</MenuItem>
                  <MenuItem value="low-stock">Low Stock</MenuItem>
                  <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Image URL"
                fullWidth
                variant="outlined"
                defaultValue={selectedItem?.image || ""}
                helperText="Enter a URL for the item image"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button className="customer-button" onClick={handleSaveItem}>
            {selectedItem ? "Update Item" : "Add Item"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
