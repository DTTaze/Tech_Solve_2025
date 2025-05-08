import React from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventCard from "./EventCard";

const EventList = ({ events, onEdit, onDelete, onCreate }) => {
  if (events.length === 0) {
    return (
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
            onClick={onCreate}
            sx={{ mt: 2 }}
          >
            Create Event
          </Button>
        </Box>
      </Grid>
    );
  }

  return (
    <>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.id}>
          <EventCard event={event} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </>
  );
};

export default EventList;
