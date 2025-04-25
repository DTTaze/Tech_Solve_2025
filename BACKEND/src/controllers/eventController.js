const eventService = require('../services/eventService');

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
}

const handleGetAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents();
        return res.success("Events retrieved successfully", events);
    } catch (error) {
        console.error("Error retrieving events:", error);
        return res.error(500, "Error retrieving events", error);
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
}

module.exports = {
    handleGetEventbyId,
    handleGetAllEvents,
    handleCreateEvent,
}