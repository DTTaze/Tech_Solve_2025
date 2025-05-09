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
    const userId = req.params.user_id ? req.params.user_id : req.user.id;
    const events = await eventService.getEventSigned(userId);
    return res.success("Events retrieved successfully", events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    return res.error(500, "Error retrieving events", error);
  }
};

const handleGetEventSignedByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const events = await eventService.getEventSignedByUserId(userId);
    return res.success("Events retrieved successfully", events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    return res.error(500, "Error retrieving events", error);
  }
};

const handGetEventsOfCreator = async (req, res) => {
  try {
    const creator_id = req.user.id;
    const events = await eventService.getEventsOfCreator(creator_id);
    return res.success("Events retrieved successfully", events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    return res.error(500, "Error retrieving events", error);
  }
};

const handleDeleteEventUserById = async (req, res) => {
  try {
    const eventUserId = Number(req.params.eventUser_id);
    const result = await eventService.deleteEventUserById(eventUserId);
    if (!result) {
      return res.error(404, "Event user have not been delete");
    }
    return res.success("Event user delete successfully");
  }
  catch (error) {
    console.error("Error delete event user:", error);
    return res.error(500, "Error delete event user", error);
  }
}

const handlegetEventUserByEventId = async (req, res) => {
  try {
    const eventId = Number(req.params.event_id);
    const event = await eventService.getEventUserByEventId(eventId);
    if (!event) {
      return res.error(404, "Event not found");
    }
    return res.success("Event users retrieved successfully", event);
  }
  catch (error) {
    console.error("Error retrieving event users:", error);
    return res.error(500, "Error retrieving event users", error);
  }
}

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
    const eventId = Number(req.params.event_id);
    const userId = Number(req.user.id);
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
    const eventId = Number(req.params.event_id);
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

const handleCheckInUserByUserId = async (req,res) => {
  try {
    const event_id = Number(req.body.event_id)
    const user_id = Number(req.body.user_id)
    const result = await eventService.checkInUserByUserId(event_id, user_id);
    if (!result) {
      return res.error(404, "EventUser not found");
    }
    return res.success("User checked in successfully", result);
  } catch (error){
    console.error("Error check in eventUser:", error);
    return res.error(500,"Error check in eventUser:",error);
  }
}

const handleCheckOutUserByUserId = async (req,res) => {
  try{
    const event_id = Number(req.body.event_id)
    const user_id = Number(req.body.user_id)
    const result = await eventService.checkOutUserByUserId(event_id, user_id);
    return res.success("User checked in successfully", result);
  } catch (error){
    console.error("Error check out eventUser:", error);
    return res.error(500,"Error check out eventUser:",error);
  }
}



module.exports = {
  handleGetEventbyId,
  handleGetAllEvents,
  handleGetEventSigned,
  handleGetEventSignedByUserId,
  handGetEventsOfCreator,
  handlegetEventUserByEventId,
  handleCreateEvent,
  handleAcceptEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  handleCheckInUserByUserId,
  handleCheckOutUserByUserId,
  handleDeleteEventUserById
};
