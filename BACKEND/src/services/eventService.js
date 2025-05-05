const db = require("../models/index");
const Event = db.Event;
const EventUser = db.EventUser;
const User = db.User;
const Image = db.Image;
const { nanoid } = require("nanoid");
const { uploadImages, deleteImages } = require("./imageService");
const cloudinary = require("../config/cloudinary");
const {getUserByID} = require("./userService");

const getEventById = async (eventId) => {
  try {
    const event = await Event.findOne({
      where: { id: eventId },
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["username"],
        },
      ],
    });

    const uploadedImages = await db.Image.findAll({
      where: {
        reference_id: eventId,
        reference_type: "event",
      },
      attributes: ["url"],
    });

    if (!event) {
      throw new Error("Event not found");
    }

    return {
      ...event.toJSON(),
      images: uploadedImages.map((image) => image.url),
    };
  } catch (error) {
    console.error("Error retrieving event:", error);
    throw error;
  }
};

const getAllEvents = async () => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["username"],
        },
      ],
    });

    const eventsWithImages = await Promise.all(
      events.map(async (event) => {
        const uploadedImages = await db.Image.findAll({
          where: {
            reference_id: event.id,
            reference_type: "event",
          },
          attributes: ["url"],
        });

        return {
          ...event.toJSON(),
          images: uploadedImages.map((image) => image.url),
        };
      })
    );

    return eventsWithImages;
  } catch (error) {
    console.error("Error retrieving events:", error);
    throw error;
  }
};

const getEventSigned = async (userId) => {
  try {
    const allEvents = await EventUser.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Event,
          attributes: [
            "title",
            "description",
            "location",
            "capacity",
            "status",
            "start_time",
            "end_time",
          ],
        },
      ],
    });

    return allEvents;
  } catch (error) {
    console.error("Error retrieving signed events:", error);
    throw error;
  }
};

const getEventsOfCreator = async (creator_id) => {
  try {
    const events = await Event.findAll({
      where: { creator_id },
    });

    return events;
  } catch (error) {
    console.error("Error get events of creator:", error);
    throw error;
  }
};

const getEventUserByEventId = async (event_id) => {
  try {
    const EventUsers = await EventUser.findAll({
      where: { event_id },
      attributes: ["user_id"],
    });

    const userIds = EventUsers.map((eventUser) => eventUser.user_id);

    let users = [];
    for (const userId of userIds) {
      const user = await getUserByID(Number(userId));
      if (user) {
        users.push(user);
      }
    }

    return users;

  }catch (error) {
    console.error("Error retrieving event users:", error);
    throw error;
  }

}

const createEvent = async (Data, user_id, images) => {
  try {
    const { title, description, location, capacity, start_time, end_time } =
      Data;

    // Validate required fields
    if (
      !title ||
      !description ||
      !start_time ||
      !end_time ||
      !location ||
      !capacity
    ) {
      throw new Error("All fields are required");
    }

    // Validate datetime format
    const isValidDate = (date) => !isNaN(Date.parse(date));
    if (!isValidDate(start_time) || !isValidDate(end_time)) {
      console.log("start_time", start_time);
      console.log("end_time", end_time);
      throw new Error("Invalid date format for start_time or end_time");
    }

    const event = await Event.create({
      public_id: nanoid(),
      creator_id: user_id,
      title,
      description,
      location,
      capacity,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
    });

    let uploadedImages = [];
    if (images && images.length > 0) {
      uploadedImages = await uploadImages(images, event.id, "event");
    }

    return {
      ...event.toJSON(),
      images: uploadedImages.map((image) => image.url),
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const acceptEvent = async (eventId, userId) => {
  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const eventUser = await EventUser.create({
      event_id: eventId,
      user_id: userId,
    });

    return eventUser;
  } catch (error) {
    console.error("Error accepting event:", error);
    throw error;
  }
};

const updateEvent = async (event_id, Data, images) => {
  try {
    const {
      title,
      description,
      location,
      capacity,
      start_time,
      end_time,
      status,
    } = Data;
    let updateFields = {};

    if (title) {
      updateFields.title = title;
    }
    if (description) {
      updateFields.description = description;
    }
    if (location) {
      updateFields.location = location;
    }

    if (capacity) {
      if (Number(capacity !== capacity)) {
        throw new Error("Capacity must be a number");
      }
      if (capacity < 0) {
        throw new Error("Capacity must be greater than 0");
      }
      updateFields.capacity = capacity;
    }

    const isValidDate = (date) => !isNaN(Date.parse(date));
    if (start_time) {
      if (!isValidDate(start_time)) {
        console.log("start_time", start_time);
        throw new Error("Invalid date format for start_time");
      }
      updateFields.start_time = new Date(start_time);
    }

    if (end_time) {
      if (!isValidDate(end_time)) {
        console.log("end_time", end_time);
        throw new Error("Invalid date format for end_time");
      }
      updateFields.end_time = new Date(end_time);
    }

    if (status) {
      const validStatuses = ["upcoming", "ongoing", "finished"];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status value");
      }
      updateFields.status = status;
    }

    const event = await Event.findByPk(event_id);

    if (!event) {
      throw new Error("Event not found");
    }

    await event.update(updateFields);

    let uploadedImages = [];

    if (images && images.length > 0) {
      await deleteImages(event.id, "event");

      uploadedImages = await uploadImages(images, event.id, "event");

      if (!uploadedImages || uploadedImages.length === 0) {
        throw new Error("Failed to upload images");
      }
    } else {
      uploadedImages = await db.Image.findAll({
        where: {
          reference_id: event.id,
          reference_type: "event",
        },
        attributes: ["url"],
      });
    }

    return {
      ...event.toJSON(),
      images: uploadedImages.map((image) => image.url),
    };
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

const deleteEvent = async (event_id) => {
  try {
    const event = await Event.findByPk(event_id);
    if (!event) {
      throw new Error("Event not found");
    }

    const listImagesBeforeDelete = await deleteImages(event_id, "event");

    await event.destroy();
    return {
      ...event.toJSON(),
      images: listImagesBeforeDelete,
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

const checkInUserByUserId = async (event_id, user_id) => {
  try {
    if (!event_id || !user_id) {
      throw new Error("Event ID and User ID are required");
    }
    const event = await Event.findByPk(event_id);
    if (!event) {
      throw new Error("Event not found");
    }

    const eventUser = await EventUser.findOne({
      where: { event_id, user_id },
    });

    if (!eventUser) {
      throw new Error("User not found in this event");
    }

    await eventUser.update({ joined_at: new Date() });

    return eventUser;
  } catch (error) {
    console.error("Error checking in user:", error);
    throw error;
  }
};

module.exports = {
  getEventById,
  getAllEvents,
  getEventSigned,
  getEventsOfCreator,
  getEventUserByEventId,
  createEvent,
  acceptEvent,
  updateEvent,
  deleteEvent,
  checkInUserByUserId,
};
