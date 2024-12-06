import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const CLIENT_ID = "16844726883-nktuvt7v0fvoua9h948nvvl5ljddau9p.apps.googleusercontent.com"; // Replace with your Google OAuth Client ID
const SCOPES = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";

function Reserve() {
  const [events, setEvents] = useState([]); // Calendar events
  const [error, setError] = useState(null); // Error messages
  const [token, setToken] = useState(null); // Google OAuth token
  const [selectedRoom, setSelectedRoom] = useState(""); // Selected room
  const [availableTimes, setAvailableTimes] = useState([]); // Available times
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    email: "",
  });

  const rooms = [
    { id: "room1", name: "Room 1", times: ["09:00", "10:00", "11:00"] },
    { id: "room2", name: "Room 2", times: ["12:00", "13:00", "14:00"] },
  ];

  // Initialize Google API and authenticate
  useEffect(() => {
    const initializeGIS = () => {
      /* eslint-disable no-undef */
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
          if (response.access_token) {
            setToken(response.access_token);
            loadEvents(response.access_token);
          } else {
            setError("Error obtaining Google token.");
          }
        },
      });

      tokenClient.requestAccessToken();
    };

    const checkGoogleLoaded = () => {
      if (typeof google === "undefined") {
        setTimeout(checkGoogleLoaded, 100);
      } else {
        initializeGIS();
      }
    };

    checkGoogleLoaded();
  }, []);

  // Load events from Google Calendar
  const loadEvents = (accessToken) => {
    gapi.load("client", () => {
      gapi.client
        .init({
          apiKey: "",
          clientId: CLIENT_ID,
          scope: SCOPES,
        })
        .then(() => {
          return gapi.client.request({
            path: "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          });
        })
        .then((response) => {
          const formattedEvents = response.result.items.map((event) => ({
            title: event.summary,
            start: event.start.dateTime,
            end: event.end.dateTime,
          }));
          setEvents(formattedEvents);
        })
        .catch((error) => {
          console.error("Error loading events from Google Calendar:", error);
          setError("Failed to load events. Please try again.");
        });
    });
  };

  // Add a reservation to Google Calendar
  const addReservationToGoogleCalendar = (reservation) => {
    gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        resource: {
          summary: `Room ${reservation.room_id} - Reserved by ${reservation.email}`,
          start: {
            dateTime: reservation.start_time,
            timeZone: "UTC",
          },
          end: {
            dateTime: reservation.end_time,
            timeZone: "UTC",
          },
        },
      })
      .then((response) => {
        // Add the reservation locally to events
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: `Room ${reservation.room_id} - Reserved by ${reservation.email}`,
            start: reservation.start_time,
            end: reservation.end_time,
          },
        ]);
        alert(`Reservation confirmed and added to Google Calendar.`);
      })
      .catch((error) => {
        console.error("Error adding reservation to Google Calendar:", error);
        setError("Failed to add reservation. Please try again.");
      });
  };

  const handleRoomChange = (e) => {
    const room = rooms.find((r) => r.id === e.target.value);
    setSelectedRoom(room.id);
    setAvailableTimes(room.times);
  };

  const handleReservation = (e) => {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in to add a reservation.");
      return;
    }

    const newReservation = {
      room_id: selectedRoom,
      email: formData.email,
      start_time: `${formData.date}T${formData.time}:00`,
      end_time: `${formData.date}T${parseInt(formData.time.split(":")[0]) + 1}:00:00`,
    };

    // Add to Google Calendar
    addReservationToGoogleCalendar(newReservation);

    // Reset form
    setFormData({ date: "", time: "", email: "" });
  };

  return (
    <div>
      <h1>Room Reservations</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleReservation}>
        <label>Room: </label>
        <select onChange={handleRoomChange} value={selectedRoom} required>
          <option value="" disabled>
            Select a room
          </option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        <label>Date: </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <label>Time: </label>
        <select
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        >
          <option value="" disabled>
            Select a time
          </option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <label>Email: </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <button type="submit">Reserve</button>
      </form>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
      />
    </div>
  );
}

export default Reserve;
