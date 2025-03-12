import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventCorrelation = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get('http://localhost:8000/correlate_events');
      setEvents(response.data.events);
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Event Correlation</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <a href={event.url} target="_blank" rel="noopener noreferrer">
              {event.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventCorrelation;