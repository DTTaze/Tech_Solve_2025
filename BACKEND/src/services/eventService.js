const db = require("../models/index");
const Event = db.Event;
const EventUser = db.EventUser;
const User = db.User;
const Image = db.Image;
const { nanoid } = require("nanoid");
const { uploadImages, deleteImages } = require("./imageService");
const cloudinary = require("../config/cloudinary");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const {getImageById} = require("./imageService");
const { getUserByID } = require("./userService");
const { get } = require("../routes/eventRoutes");

const getEventById = async (eventId) => {
  try {
    const cachedEvent = await getCache(`event:id:${eventId}`);
    if (cachedEvent) {
      console.log("cachedEvent", cachedEvent);
      const event = (cachedEvent);
      let uploadedImages = [];
      for (const imageId of event.imagesId) {
        if (!imageId) {
          continue;
        }
        // Check if imageId is valid
        const image = await getImageById(imageId);
        if (image) {
          uploadedImages.push(image);
        }
      };
      const creator = await getUserByID(event.creator_id);

      const imagesFormat = uploadedImages.reduce((acc, image) => {
        if (!acc[image.reference_id]) {
          acc[image.reference_id] = [];
        }
        acc[image.reference_id].push(image.url);
        return acc;
      },{});

      const eventFormat = {
        ...event,
        images: imagesFormat,
        creator: {
          username : creator.username},
      };
      delete eventFormat.imagesId;
      return eventFormat;
    }

    const event = await Event.findOne({
      where: { id: eventId },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["username"],
        },
      ],
    });

    const uploadedImages = await Image.findAll({
      where: {
        reference_id: eventId,
        reference_type: "event",
      },
      attributes: ["url"],
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const cachedEventFormat = {
      ...event.toJSON(),
      imagesId: uploadedImages.map((image) => image.id),
    }
    delete cachedEventFormat.images;
    delete cachedEventFormat.creator;
    await setCache(`event:id:${eventId}`, cachedEventFormat);

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
    const cachedEventIds = await getCache(`event:all`);
    if (cachedEventIds) {
      console.log("cachedEventIds", cachedEventIds);
      const events = [];
      for (const eventId of cachedEventIds) {
        const event = await getEventById(eventId);
        if (event) {
          events.push(event);
        }
      }
      return events;
    }

    const events = await Event.findAll({
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["username"],
        },
      ],
    });
    const eventsWithImages = [];
    const eventIds = [];
    for (const event of events) {
      const uploadedImages = await Image.findAll({
        where: {
          reference_id: event.id,
          reference_type: "event",
        },
        attributes: ["url"],
      });
      const imagesFormat = uploadedImages.reduce((acc, image) => {
        if (!acc[image.reference_id]) {
          acc[image.reference_id] = [];
        }
        acc[image.reference_id].push(image.url);
        return acc;
      },{});
      const eventFormat = {
        ...event.toJSON(),
        images: imagesFormat,
      };
      eventsWithImages.push(eventFormat);

      eventIds.push(event.id);
    }

    // Cache all events
    await setCache(`event:all`, eventIds);

    return eventsWithImages;
  } catch (error) {
    console.error("Error retrieving events:", error);
    throw error;
  }
};

const getEventSigned = async (user_id) => {
  try {
    const allEvents = await EventUser.findAll({
      where: { user_id },
      include: [
        {
          model: Event,
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
    const cachedEventIds = await getCache(`event:all`);
    if (cachedEventIds) {
      console.log("cachedEventIds", cachedEventIds);
      const events = [];
      for (const eventId of cachedEventIds) {
        const event = await getEventById(eventId);
        if (event && event.creator_id === creator_id) {
          events.push(event);
        }
      }
      return events;
    }
    const events = await Event.findAll({
      where: { creator_id },
    });

    return events;
  } catch (error) {
    console.error("Error get events of creator:", error);
    throw error;
  }
};

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

    // Check creator_id
    const creator = await getUserByID(user_id);

    // Validate datetime format
    const isValidDate = (date) => !isNaN(Date.parse(date));
    if (!isValidDate(start_time) || !isValidDate(end_time)) {
      console.log("start_time", start_time);
      console.log("end_time", end_time);
      throw new Error("Invalid date format for start_time or end_time");
    }

    const event = await db.Event.create({
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
    
    const imagesFormat = uploadedImages.reduce((acc, image) => {
      if (!acc[image.reference_id]) {
        acc[image.reference_id] = [];
      }
      acc[image.reference_id].push(image.url);
      return acc;
    }
    ,{});

    // Cache the event
    const eventCacheFormat = {
      ...event.toJSON(),
      imagesId: uploadedImages.map((image) => image.id),
    };
    await setCache(`event:id:${event.id}`, eventCacheFormat);

    return {
      ...event.toJSON(),
      creator: {
        id: creator.id,
        username: creator.username,
      },
      images: imagesFormat,
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
    //delete cache
    await deleteCache(`event:id:${event_id}`);

    let uploadedImages = [];

    if (images && images.length > 0) {
      // Delete old images and cache
      await deleteImages(event.id, "event");
      // Upload new images and cache
      uploadedImages = await uploadImages(images, event.id, "event");

      if (!uploadedImages || uploadedImages.length === 0) {
        throw new Error("Failed to upload images");
      }
    } else {
      uploadedImages = await Image.findAll({
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

    listImagesBeforeDelete = listImagesBeforeDelete.reduce((acc, image) => {
      if (!acc[image.reference_id]) {
        acc[image.reference_id] = [];
      }
      acc[image.reference_id].push(image.url);
      return acc;
    }
    ,{});

    //delete cache
    await deleteCache(`event:id:${event_id}`);
    let eventIds = await getCache('event:all');
    eventIds = eventIds.filter((id) => Number(id) != event_id)
    await setCache('event:all', eventIds)

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
  createEvent,
  acceptEvent,
  updateEvent,
  deleteEvent,
  checkInUserByUserId,
};
