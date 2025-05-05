import React, { useState, useEffect } from "react";
import { getAllEventsApi } from "../../../utils/api.js";
import { toast } from "react-toastify";

const EventBanner = () => {
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEventsApi();
        if (response?.data) {
          setEvents(response.data);
        }
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
    if (events.length > 1) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prevIndex) =>
          prevIndex === events.length - 1 ? 0 : prevIndex + 1
        );
      }, Math.random() * 2000 + 3000); // Random time between 3-5 seconds

      return () => clearInterval(interval);
    }
  }, [events]);

  if (loading || events.length === 0) {
    return null;
  }

  const currentEvent = events[currentEventIndex];

  return (
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

      {/* Content */}
      <div className="relative h-full flex items-center justify-between px-8">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">{currentEvent.title}</h2>
          <p className="text-sm mb-4 line-clamp-2">
            {currentEvent.description}
          </p>
          <div className="flex items-center space-x-4 text-sm">
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
          className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg transform active:scale-95"
          onClick={() => {}}
        >
          Tham gia ngay!
        </button>
      </div>

      {/* Event Indicators */}
      <div className="absolute bottom-4 left-8 flex space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentEventIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentEventIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default EventBanner;
