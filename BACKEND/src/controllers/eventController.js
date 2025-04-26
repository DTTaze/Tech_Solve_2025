const eventService = require("../services/eventService");

const handleGetEventbyId = async (req, res) => {
  try {
    const eventId = req.params.event_id;
    const event = await eventService.getEventById(eventId);
    if (!event) {
      return res.error(404, "Event not found");
    }
    return res.success("Event gotten successfully", event);
  } catch (error) {
    console.error("Error retrieving event:", error);
    return res.error(500, "Error retrieving event", error);
  }
};

const handleGetAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    return res.success("Events retrieved successfully", events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    return res.error(500, "Error retrieving events", error);
  }
};

const handleGetEventSigned = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await eventService.getEventSigned(userId);
    return res.success("Events retrieved successfully", events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    return res.error(500, "Error retrieving events", error);
  }
};

const handGetEventsOfOwner = async (req, res) => {
  try {
    const creator_id = req.user.id;
    const events = await eventService.getEventsOfOwner(creator_id);
    return res.success("Events retrieved successfully", events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    return res.error(500, "Error retrieving events", error);
  }
};

const handleCreateEvent = async (req, res) => {
  try {
    const images = req.files;
    const user_id = req.user.id;
    const event = await eventService.createEvent(req.body, user_id, images);
    if (!event) {
      return res.error(500, "Event creation failed");
    }
    return res.success("Event created successfully", event);
  } catch (error) {
    console.error("Error creating event:", error);
    return res.error(500, "Error creating event", error);
  }
};

const handleAcceptEvent = async (req, res) => {
  try {
    const eventId = req.params.event_id;
    const userId = req.user.id;
    const event = await eventService.acceptEvent(eventId, userId);
    if (!event) {
      return res.error(404, "Event not found");
    }
    return res.success("Event accepted successfully", event);
  } catch (error) {
    console.error("Error accepting event:", error);
    return res.error(500, "Error accepting event", error);
  }
};

const handleUpdateEvent = async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const images = req.files;
    const event = await eventService.updateEvent(event_id, req.body, images);
    if (!event) {
      return res.error(404, "Event not found");
    }
    return res.success("Event updated successfully", event);
  } catch (error) {
    console.error("Error updating event:", error);
    return res.error(500, "Error updating event", error);
  }
};

const handleDeleteEvent = async (req, res) => {
  try {
    const eventId = req.params.event_id;
    const event = await eventService.deleteEvent(eventId);
    if (!event) {
      return res.error(404, "Event not found");
    }
    return res.success("Event deleted successfully", event);
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.error(500, "Error deleting event", error);
  }
};

module.exports = {
  handleGetEventbyId,
  handleGetAllEvents,
  handleGetEventSigned,
  handGetEventsOfOwner,
  handleCreateEvent,
  handleAcceptEvent,
  handleUpdateEvent,
  handleDeleteEvent,
};
