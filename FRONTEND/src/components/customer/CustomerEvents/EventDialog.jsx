import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";

const EventDialog = ({ open, onClose, selectedEvent, onSave }) => {
  const [formData, setFormData] = React.useState({
    title: selectedEvent?.title || "",
    description: selectedEvent?.description || "",
    location: selectedEvent?.location || "",
    capacity: selectedEvent?.capacity || "",
    start_time: selectedEvent?.start_time || "",
    end_time: selectedEvent?.end_time || "",
    end_sign: selectedEvent?.end_sign || "",
    status: selectedEvent?.status || "upcoming",
    images: null,
  });

  // Reset form data when selectedEvent changes
  React.useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title || "",
        description: selectedEvent.description || "",
        location: selectedEvent.location || "",
        capacity: selectedEvent.capacity || "",
        start_time: selectedEvent.start_time || "",
        end_time: selectedEvent.end_time || "",
        end_sign: selectedEvent.end_sign || "",
        status: selectedEvent.status || "upcoming",
        images: selectedEvent.images?.[selectedEvent.id]?.[0] || null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        location: "",
        capacity: "",
        start_time: "",
        end_time: "",
        end_sign: "",
        status: "upcoming",
        images: null,
      });
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        images: file,
      }));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {selectedEvent ? "Edit Event" : "Create New Event"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Event Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="start_time"
              label="Start Time"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={formData.start_time}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="end_time"
              label="End Time"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={formData.end_time}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="end_sign"
              label="End Sign"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={formData.end_sign}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="location"
              label="Location"
              fullWidth
              variant="outlined"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="capacity"
              label="Capacity"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              {selectedEvent &&
                selectedEvent.images &&
                selectedEvent.images[selectedEvent.id] && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Current Image:
                    </Typography>
                    <img
                      src={selectedEvent.images[selectedEvent.id][0]}
                      alt="Current event"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </Box>
                )}
              <Typography variant="subtitle2" gutterBottom>
                {selectedEvent ? "Change Image" : "Upload Image"}
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "block" }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button className="customer-button" onClick={handleSubmit}>
          {selectedEvent ? "Update Event" : "Create Event"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
