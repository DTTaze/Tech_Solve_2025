import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default function CustomerProfile({ context: userInfo }) {
  const [formData, setFormData] = useState({
    full_name: userInfo?.full_name || "",
    email: userInfo?.email || "",
    phone_number: userInfo?.phone_number || "",
    username: userInfo?.username || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log("Profile update:", formData);
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Profile Settings
      </Typography>

      <Paper className="customer-card" sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            src={userInfo?.avatar_url}
            alt={userInfo?.full_name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{ mb: 1 }}
          >
            <input hidden accept="image/*" type="file" />
            <PhotoCamera />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Click to change profile picture
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  className="customer-button"
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
