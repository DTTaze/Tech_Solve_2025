import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FilterListIcon from "@mui/icons-material/FilterList";

// Sample data for events
const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Tree Planting Initiative",
    description:
      "Join us for a community tree planting event to improve local green spaces.",
    image:
      "https://images.unsplash.com/photo-1586967487057-8c546a7b5b48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2023-06-15",
    location: "City Park",
    status: "active",
    participants: 45,
    category: "environment",
  },
  {
    id: 2,
    title: "Beach Clean-up Drive",
    description: "Help clean our local beaches and prevent ocean pollution.",
    image:
      "https://images.unsplash.com/photo-1622403574443-0702c114e2da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2023-07-22",
    location: "West Coast Beach",
    status: "active",
    participants: 32,
    category: "environment",
  },
  {
    id: 3,
    title: "Tech Innovation Fair",
    description:
      "Exhibition of sustainable technology innovations for a greener future.",
    image:
      "https://images.unsplash.com/photo-1581092787765-e3feb951d987?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2023-08-10",
    location: "Convention Center",
    status: "upcoming",
    participants: 120,
    category: "technology",
  },
  {
    id: 4,
    title: "Renewable Energy Workshop",
    description:
      "Learn about renewable energy solutions for homes and businesses.",
    image:
      "https://images.unsplash.com/photo-1542336305-ac7735cd1886?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2023-09-05",
    location: "Community Center",
    status: "upcoming",
    participants: 28,
    category: "education",
  },
  {
    id: 5,
    title: "Wildlife Conservation Talk",
    description:
      "Discussion with experts on local wildlife conservation efforts.",
    image:
      "https://images.unsplash.com/photo-1564509027875-26943a1029df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2023-05-20",
    location: "City Library",
    status: "completed",
    participants: 65,
    category: "education",
  },
  {
    id: 6,
    title: "Sustainable Fashion Show",
    description:
      "Showcase of eco-friendly fashion designs and sustainable materials.",
    image:
      "https://images.unsplash.com/photo-1569212889298-82283757a49e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "2023-04-12",
    location: "Arts Center",
    status: "completed",
    participants: 89,
    category: "culture",
  },
];

export default function CustomerEvents() {
  const userInfo = useOutletContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter events based on selected tab, search term, and category
  const filteredEvents = events.filter((event) => {
    const matchesTab =
      tabValue === 0 ||
      (tabValue === 1 && event.status === "active") ||
      (tabValue === 2 && event.status === "upcoming") ||
      (tabValue === 3 && event.status === "completed");

    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;

    return matchesTab && matchesSearch && matchesCategory;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (event = null) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = () => {
    // Here would go the logic to save the event to backend
    handleCloseDialog();
  };

  const handleDeleteEvent = (id) => {
    // Here would go the logic to delete the event from backend
    setEvents(events.filter((event) => event.id !== id));
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
            Event Management
          </Typography>

          <Button
            className="customer-button"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Event
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
            placeholder="Search events..."
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
                <MenuItem value="environment">Environment</MenuItem>
                <MenuItem value="technology">Technology</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="culture">Culture</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              size="small"
              sx={{
                borderColor: "var(--light-green)",
                color: "var(--primary-green)",
                "&:hover": {
                  borderColor: "var(--primary-green)",
                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                },
              }}
            >
              Filters
            </Button>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--primary-green)",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "var(--primary-green)",
            },
          }}
        >
          <Tab label="All Events" />
          <Tab label="Active" />
          <Tab label="Upcoming" />
          <Tab label="Completed" />
        </Tabs>

        <Grid container spacing={3}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card className="event-card">
                  <Box className="event-card-image">
                    <CardMedia
                      component="img"
                      image={event.image}
                      alt={event.title}
                    />
                    <Box className="event-card-date">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Box>
                  </Box>
                  <CardContent sx={{ pb: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        className="event-card-title"
                        sx={{ flex: 1 }}
                      >
                        {event.title}
                      </Typography>
                      <Box>
                        <Chip
                          label={event.status}
                          size="small"
                          color={
                            event.status === "active"
                              ? "success"
                              : event.status === "upcoming"
                              ? "info"
                              : "default"
                          }
                          sx={{ textTransform: "capitalize" }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 2,
                        height: "40px",
                      }}
                    >
                      {event.description}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOnIcon
                        fontSize="small"
                        sx={{ color: "var(--text-light)", mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PeopleIcon
                        fontSize="small"
                        sx={{ color: "var(--text-light)", mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {event.participants} Participants
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(event)}
                        sx={{ color: "var(--primary-green)" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteEvent(event.id)}
                        sx={{ color: "var(--error)" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
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
                  No events found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters or create a new event
                </Typography>
                <Button
                  className="customer-button"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  sx={{ mt: 2 }}
                >
                  Create Event
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Event Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {selectedEvent ? "Edit Event" : "Create New Event"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Event Title"
                fullWidth
                variant="outlined"
                defaultValue={selectedEvent?.title || ""}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                defaultValue={selectedEvent?.description || ""}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                defaultValue={selectedEvent?.date || ""}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                fullWidth
                variant="outlined"
                defaultValue={selectedEvent?.location || ""}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedEvent?.status || "upcoming"}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  defaultValue={selectedEvent?.category || "environment"}
                >
                  <MenuItem value="environment">Environment</MenuItem>
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="culture">Culture</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                fullWidth
                variant="outlined"
                defaultValue={selectedEvent?.image || ""}
                helperText="Enter a URL for the event image"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button className="customer-button" onClick={handleSaveEvent}>
            {selectedEvent ? "Update Event" : "Create Event"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
