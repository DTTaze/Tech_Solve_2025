import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const EVENTS = [
  {
    id: 1,
    name: "Tree Planting Initiative",
    date: "2023-06-15",
    location: "City Park",
  },
  {
    id: 2,
    name: "Beach Clean-up Drive",
    date: "2023-07-22",
    location: "West Coast Beach",
  },
  {
    id: 3,
    name: "Tech Innovation Fair",
    date: "2023-08-10",
    location: "Convention Center",
  },
  {
    id: 4,
    name: "Renewable Energy Workshop",
    date: "2023-09-05",
    location: "Community Center",
  },
  {
    id: 5,
    name: "Wildlife Conservation Talk",
    date: "2023-05-20",
    location: "City Library",
  },
  {
    id: 6,
    name: "Sustainable Fashion Show",
    date: "2023-04-12",
    location: "Arts Center",
  },
];

export const getEventNameById = (eventId) => {
  const event = EVENTS.find((e) => e.id === eventId);
  return event ? event.name : "Unknown Event";
};

export default function EventSelector({ selectedEvent, onEventChange }) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel id="event-select-label">Event</InputLabel>
      <Select
        labelId="event-select-label"
        id="event-select"
        value={selectedEvent}
        label="Event"
        onChange={onEventChange}
      >
        {EVENTS.map((event) => (
          <MenuItem key={event.id} value={event.id}>
            {event.name} - {new Date(event.date).toLocaleDateString()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
