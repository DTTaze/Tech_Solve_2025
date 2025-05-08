import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  createEventApi,
  getOwnerEventApi,
  updateEventApi,
  deleteEventApi,
} from "../../../utils/api";
import EventFilters from "./EventFilters";
import EventList from "./EventList";
import EventDialog from "./EventDialog";

export default function CustomerEvents() {
  const userInfo = useOutletContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getOwnerEventApi();

        console.log("event response: ", response);
        if (response && response.data) {
          setEvents(response.data);
        }
      } catch (err) {
        setError("Failed to fetch events");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  const handleSaveEvent = async (formData) => {
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        start_time: formData.start_time,
        end_time: formData.end_time,
        end_sign: formData.end_sign,
        status: formData.status,
      };

      let response;
      if (selectedEvent) {
        // Only include images in the update if a new image was selected
        const images = formData.images ? [formData.images] : undefined;
        response = await updateEventApi(selectedEvent.id, eventData, images);
      } else {
        // For new events, always include images (even if empty array)
        const images = formData.images ? [formData.images] : [];
        response = await createEventApi(eventData, images);
      }

      if (response && response.data) {
        const updatedEvents = await getOwnerEventApi();
        if (updatedEvents && updatedEvents.data) {
          setEvents(updatedEvents.data);
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Failed to save event");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const response = await deleteEventApi(id);
      if (response && response.data) {
        const updatedEvents = await getOwnerEventApi();
        if (updatedEvents && updatedEvents.data) {
          setEvents(updatedEvents.data);
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <Box className="customer-content-container">
        <Typography>Loading events...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="customer-content-container">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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

        <EventFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

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

        <EventList
          events={filteredEvents}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteEvent}
          onCreate={() => handleOpenDialog()}
        />
      </Box>

      <EventDialog
        open={open}
        onClose={handleCloseDialog}
        selectedEvent={selectedEvent}
        onSave={handleSaveEvent}
      />
    </Box>
  );
}
