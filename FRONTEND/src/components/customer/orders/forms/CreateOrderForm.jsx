import React from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";

const CreateOrderForm = ({
  newOrder,
  setNewOrder,
  handleCreateOrder,
  handleCloseDialog,
  calculatePoints,
  shippingAccounts,
  wasteCategories,
  handleAddItem,
  handleRemoveItem,
  handleItemChange,
}) => {
  return (
    <>
      <DialogTitle
        sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
      >
        Create New Recycling Order
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Order Details
            </Typography>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Shipping Account</InputLabel>
              <Select
                value={newOrder.shippingAccountId}
                label="Shipping Account"
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    shippingAccountId: e.target.value,
                  })
                }
              >
                {shippingAccounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} {account.isDefault ? "(Default)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Pickup Address"
              fullWidth
              value={newOrder.address}
              onChange={(e) =>
                setNewOrder({ ...newOrder, address: e.target.value })
              }
              margin="normal"
              required
              multiline
              rows={2}
            />

            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "var(--light-green)",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: "var(--primary-green)" }}
              >
                Estimated Coins: {calculatePoints(newOrder.items)}
              </Typography>
              <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                Final amount may vary based on actual weight and quality
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Items to Recycle
            </Typography>

            {newOrder.items.map((item, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid var(--grey-200)",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2">Item {index + 1}</Typography>
                  {index > 0 && (
                    <IconButton
                      onClick={() => handleRemoveItem(index)}
                      color="error"
                      size="small"
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={item.type}
                    label="Type"
                    onChange={(e) =>
                      handleItemChange(index, "type", e.target.value)
                    }
                  >
                    {wasteCategories
                      .map((category) => (
                        <MenuItem
                          key={category.name}
                          disabled
                          sx={{
                            opacity: 1,
                            fontWeight: "bold",
                            backgroundColor: "var(--light-green)",
                          }}
                        >
                          {category.name}
                        </MenuItem>
                      ))
                      .concat(
                        wasteCategories.flatMap((category) =>
                          category.types.map((type) => (
                            <MenuItem
                              key={type.id}
                              value={type.id}
                              sx={{ pl: 4 }}
                            >
                              {type.label} ({type.points} points/unit)
                            </MenuItem>
                          ))
                        )
                      )}
                  </Select>
                </FormControl>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Quantity"
                      type="number"
                      fullWidth
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Unit</InputLabel>
                      <Select
                        value={item.unit}
                        label="Unit"
                        onChange={(e) =>
                          handleItemChange(index, "unit", e.target.value)
                        }
                      >
                        <MenuItem value="kg">kg</MenuItem>
                        <MenuItem value="items">items</MenuItem>
                        <MenuItem value="bags">bags</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{
                mt: 1,
                color: "var(--primary-green)",
                "&:hover": {
                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                },
              }}
            >
              Add Another Item
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleCloseDialog}
          className="customer-button-secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateOrder}
          className="customer-button"
          disabled={
            newOrder.address === "" ||
            newOrder.shippingAccountId === "" ||
            newOrder.items.some((item) => item.type === "")
          }
        >
          Create Order
        </Button>
      </DialogActions>
    </>
  );
};

export default CreateOrderForm;
