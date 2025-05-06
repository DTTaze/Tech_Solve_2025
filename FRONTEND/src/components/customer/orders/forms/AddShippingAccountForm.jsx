import React from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";

const AddShippingAccountForm = ({
  newShippingAccount,
  setNewShippingAccount,
  handleAddShippingAccount,
  handleCloseDialog,
  handleOpenManageDialog,
}) => {
  return (
    <>
      <DialogTitle
        sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
      >
        Add Shipping Account
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Account Name"
              fullWidth
              value={newShippingAccount.name}
              onChange={(e) =>
                setNewShippingAccount({
                  ...newShippingAccount,
                  name: e.target.value,
                })
              }
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Provider/Company"
              fullWidth
              value={newShippingAccount.provider}
              onChange={(e) =>
                setNewShippingAccount({
                  ...newShippingAccount,
                  provider: e.target.value,
                })
              }
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              fullWidth
              value={newShippingAccount.phone}
              onChange={(e) =>
                setNewShippingAccount({
                  ...newShippingAccount,
                  phone: e.target.value,
                })
              }
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={newShippingAccount.email}
              onChange={(e) =>
                setNewShippingAccount({
                  ...newShippingAccount,
                  email: e.target.value,
                })
              }
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={2}
              value={newShippingAccount.address}
              onChange={(e) =>
                setNewShippingAccount({
                  ...newShippingAccount,
                  address: e.target.value,
                })
              }
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={() => {
            handleCloseDialog();
            handleOpenManageDialog();
          }}
          className="customer-button-secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleAddShippingAccount();
            handleOpenManageDialog();
          }}
          className="customer-button"
          disabled={
            !newShippingAccount.name ||
            !newShippingAccount.phone ||
            !newShippingAccount.provider
          }
        >
          Add Account
        </Button>
      </DialogActions>
    </>
  );
};

export default AddShippingAccountForm;
