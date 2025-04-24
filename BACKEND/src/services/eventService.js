const db = require('../models/index');
const Event = db.Event;
const { nanoid } = require('nanoid');
const uploadImages = require('./imageService').uploadImages;

const getEventById = async (eventId) => {
    try {
        const event = await Event.findOne({
            where: { id: eventId },
            include: [
                {
                    model: db.User,
                    as: 'owner',
                    attributes: ['username']
                },
            ]
        });

        const uploadedImages = await db.Image.findAll({
            where: {
                reference_id: eventId,
                reference_type: 'event'
            },
            attributes: ['url'],
        });


        if (!event) {
            throw new Error("Event not found");
        }

        return {
            ...event.toJSON(),
            images: uploadedImages.map((image) => image.url)};
    } catch (error) {
        console.error("Error retrieving event:", error);
        throw error;
    }
}

const createEvent = async (Data, user_id, images) => {
    try {
        const { title, description, location, capacity, start_time, end_time } = Data;

        // Validate required fields
        if (!title || !description || !start_time || !end_time || !location || !capacity) {
            throw new Error("All fields are required");
        }

        // Validate datetime format
        const isValidDate = (date) => !isNaN(Date.parse(date));
        if (!isValidDate(start_time) || !isValidDate(end_time)) {
            console.log("start_time", start_time);
            console.log("end_time", end_time);
            throw new Error("Invalid date format for start_time or end_time");
        }

        const event = await db.Event.create({
            public_id: nanoid(),
            owner_id: user_id,
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

module.exports = {
    getEventById,
    createEvent,
}