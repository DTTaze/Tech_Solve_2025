import React, { useState, useEffect } from "react";
import {
  getAllEventsApi,
  getEventSignedByUserIdApi,
} from "../../../utils/api.js";
import { toast } from "react-toastify";
import EventDetailsModal from "./EventDetailsModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EventBanner = ({ userInfo }) => {
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events
        const eventsResponse = await getAllEventsApi();
        if (!eventsResponse?.data) {
          throw new Error("Không thể tải danh sách sự kiện");
        }

        // Fetch signed events
        const signedEventsResponse = await getEventSignedByUserIdApi(
          userInfo.id
        );
        const signedEventIds =
          signedEventsResponse?.data?.map((event) => event.event_id) || [];

        // Set events and participated events
        setEvents(eventsResponse.data);
        setParticipatedEvents(signedEventIds);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Không thể tải thông tin sự kiện");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 1 && !isModalOpen) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prevIndex) =>
          prevIndex === events.length - 1 ? 0 : prevIndex + 1
        );
      }, Math.random() * 2000 + 3000);

      return () => clearInterval(interval);
    }
  }, [events, isModalOpen]);

  const handlePreviousEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Previous button clicked");
    setCurrentEventIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? events.length - 1 : prevIndex - 1;
      console.log("Changing index from", prevIndex, "to", newIndex);
      return newIndex;
    });
  };

  const handleNextEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Next button clicked");
    setCurrentEventIndex((prevIndex) => {
      const newIndex = prevIndex === events.length - 1 ? 0 : prevIndex + 1;
      console.log("Changing index from", prevIndex, "to", newIndex);
      return newIndex;
    });
  };

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (loading || events.length === 0) {
    return null;
  }

  const currentEvent = events[currentEventIndex];
  const isParticipated = participatedEvents.includes(currentEvent.id);

  return (
    <>
      <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg mb-6">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${
              currentEvent.images?.[0] ||
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
            })`,
            opacity: 0.8,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-blue-600/90" />
        </div>

        {/* Navigation Buttons - Positioned at edges */}
        <button
          onClick={handlePreviousEvent}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 cursor-pointer z-10 rounded-r-xl group"
          aria-label="Previous event"
        >
          <ChevronLeft className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:scale-125" />
        </button>

        <button
          onClick={handleNextEvent}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 cursor-pointer z-10 rounded-l-xl group"
          aria-label="Next event"
        >
          <ChevronRight className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:scale-125" />
        </button>

        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-16 pointer-events-none">
          <div className="text-white max-w-2xl">
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">
              {currentEvent.title}
            </h2>
            <p className="text-sm mb-4 line-clamp-2 drop-shadow-md">
              {currentEvent.description}
            </p>
            <div className="flex items-center space-x-4 text-sm drop-shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{currentEvent.location}</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {new Date(currentEvent.start_time).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Join Button */}
          <button
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg transform active:scale-95 pointer-events-auto"
            onClick={() => handleOpenModal(currentEvent)}
          >
            {isParticipated ? "Xem chi tiết" : "Tham gia ngay!"}
          </button>
        </div>

        {/* Event Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
          {events.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 transform ${
                index === currentEventIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => setCurrentEventIndex(index)}
            />
          ))}
        </div>
      </div>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        userPublicId={userInfo.public_id}
        isParticipated={
          selectedEvent ? participatedEvents.includes(selectedEvent.id) : false
        }
      />
    </>
  );
};

export default EventBanner;
