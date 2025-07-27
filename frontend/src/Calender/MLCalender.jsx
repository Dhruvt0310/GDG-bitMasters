import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import moment from "moment";

const MLCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    event_type: "work",
    duration: 60,
    energy_level: 5,
    priority: 5,
    intensity: 5,
    flexibility: 5,
    location: "office",
    start: new Date(),
    end: new Date()
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const [mlPredictions, setMlPredictions] = useState(null);
  const [rescheduledEvents, setRescheduledEvents] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchWeeklyEvents();
  }, [selectedDate, events]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/calendar/events");
      console.log("fetch Events : ", response.data);
      setEvents(response.data);
    } catch (error) {
      showAlert("Failed to fetch events", "error");
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const eventForDate = events.find(
      (event) => moment(event.start).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
    );

    if (eventForDate) {
      setEventDetails({
        ...eventDetails,
        ...eventForDate,
        start: new Date(eventForDate.start),
        end: new Date(eventForDate.end)
      });
    } else {
      setEventDetails({
        ...eventDetails,
        title: "",
        start: date,
        end: date
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({
      ...prev,
      [name]: name === 'title' ? value : parseInt(value) || value
    }));
  };

  const getMlPredictions = async () => {
    try {
      const mealKeywords = ['dinner', 'outing', 'snack', 'party', 'relax', 'club', 'clubbing'];
      const selfCareKeywords = ['rest', 'sleep', 'gym', 'workout', 'exercise', 'meditation', 'yoga',
        'mindfulness', 'spa', 'massage', 'therapy', 'wellness', 'nap', 'stretching'];
      const importantKeywords = ['important', 'urgent', 'critical', 'sir', 'maam', 'teacher',
        'mentor', 'mentee', 'mentoring', 'mentored'];

      const isMealEvent = mealKeywords.some(keyword =>
        eventDetails.title.toLowerCase().includes(keyword)
      );
      const isSelfCareEvent = selfCareKeywords.some(keyword =>
        eventDetails.title.toLowerCase().includes(keyword)
      );
      const isImportantEvent = importantKeywords.some(keyword =>
        eventDetails.title.toLowerCase().includes(keyword)
      );

      console.log("Sending event details for ML prediction:", eventDetails);
      const response = await axios.post('http://127.0.0.1:5000/analyze-task', {
        ...eventDetails,
        duration_minutes: eventDetails.duration
      });

      if (response.data && response.data.prediction) {
        let optimal_hour = response.data.prediction.optimal_hour;
        let predicted_productivity = response.data.prediction.predicted_productivity;
        let predicted_satisfaction = response.data.prediction.predicted_satisfaction;

        // Adjust times based on event type
        if (eventDetails.event_type === 'work' || eventDetails.event_type === 'meeting') {
          if (optimal_hour < 9 || optimal_hour > 17) {
            optimal_hour = Math.floor(Math.random() * (17 - 9 + 1)) + 9;
          }
        } else if (eventDetails.event_type === 'social' || eventDetails.event_type === 'self-care' || isSelfCareEvent) {
          // Self-care events in evening (19-21)
          optimal_hour = Math.floor(Math.random() * (21 - 19 + 1)) + 19;
          predicted_satisfaction = Math.min(predicted_satisfaction * 1.5, 10); // 50% increase in satisfaction
          predicted_productivity = Math.min(predicted_productivity * 1.1, 10); // 10% increase in productivity
        }

        // Additional adjustments for meal events
        if (isMealEvent) {
          if (optimal_hour < 14 || optimal_hour > 22) {
            optimal_hour = Math.floor(Math.random() * (22 - 14 + 1)) + 14;
          }
          predicted_satisfaction = Math.min(predicted_satisfaction * 1.2, 10);
          predicted_productivity = predicted_productivity * 0.9;
        }

        // Additional adjustments for important events
        if (isImportantEvent) {
          predicted_productivity = Math.min(predicted_productivity * 1.75, 10);
        }

        const formattedPrediction = {
          optimal_hour,
          suggested_duration: response.data.prediction.suggested_duration,
          predicted_productivity,
          predicted_satisfaction,
          energy_flexibility_score: response.data.prediction.energy_flexibility_score
        };

        setMlPredictions(formattedPrediction);
        console.log("ML predictions set:", formattedPrediction);
        return formattedPrediction;
      } else {
        console.error('Prediction data is missing');
        showAlert("Failed to get ML predictions", "error");
        return null;
      }
    } catch (error) {
      console.error('Error getting ML predictions:', error);
      showAlert("Failed to get ML predictions", "error");
      return null;
    }
  };
  const handleFindBestSlot = async () => {
    if (!eventDetails.title.trim()) {
      showAlert("Please enter an event title", "error");
      return;
    }

    try {
      const prediction = await getMlPredictions();

      if (prediction) {
        const startTime = moment(selectedDate)
          .hour(prediction.optimal_hour)
          .minute(0)
          .second(0);

        setMlPredictions({
          optimal_hour: prediction.optimal_hour,
          suggested_duration: prediction.suggested_duration,
          predicted_productivity: prediction.predicted_productivity,
          predicted_satisfaction: prediction.predicted_satisfaction,
          energy_flexibility_score: prediction.energy_flexibility_score
        });

        showAlert("Best slot found using AI", "success");
      }
    } catch (error) {
      showAlert("Failed to find best slot", "error");
    }
  };

  const applyToSchedule = async () => {
    if (!mlPredictions) {
      showAlert("No ML suggestions to apply", "error");
      return;
    }

    try {
      const eventDate = moment(selectedDate);
      const startTime = eventDate
        .hour(mlPredictions.optimal_hour)
        .minute(0)
        .second(0);
      const endTime = startTime.clone().add(mlPredictions.suggested_duration, "minutes");

      const newEvent = {
        ...eventDetails,
        start: startTime.toDate(),
        end: endTime.toDate(),
        productivity: mlPredictions.predicted_productivity,
        satisfaction: mlPredictions.predicted_satisfaction,
        type: eventDetails.event_type,
        duration: mlPredictions.suggested_duration,
        optimal_hour: mlPredictions.optimal_hour,
        energy_flexibility_score: mlPredictions.energy_flexibility_score
      };

      // Check for conflicts
      const conflictingEvents = checkForConflicts(startTime, endTime);
      
      // Always add as a new event, regardless of existing events
      const response = await axios.post("http://localhost:3000/api/calendar/events/add", newEvent);
      console.log("Event to be added", newEvent);
      
      setEvents([...events, response.data]);

      // Immediately update weekly events
      fetchWeeklyEvents();
      showAlert("Event scheduled successfully", "success");
      setMlPredictions(null);

      // Reset form
      setEventDetails({
        title: "",
        event_type: "work",
        duration: 60,
        energy_level: 5,
        priority: 5,
        intensity: 5,
        flexibility: 5,
        location: "office",
        start: new Date(),
        end: new Date()
      });

    } catch (error) {
      console.error("Failed to apply ML suggestions:", error);
      showAlert("Failed to apply ML suggestions", "error");
    }
};

  const checkForConflicts = (startTime, endTime) => {
    return events.filter(event => {
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);
      
      // Check if events are on the same day
      const sameDay = eventStart.format("YYYY-MM-DD") === startTime.format("YYYY-MM-DD");
      
      // Check for time overlap
      const hasOverlap = (
        (startTime.isSameOrBefore(eventEnd) && endTime.isSameOrAfter(eventStart)) ||
        (eventStart.isSameOrBefore(endTime) && eventEnd.isSameOrAfter(startTime))
      );
      
      return sameDay && hasOverlap;
    });
  };
  

  const handleSmartManage = async (event1, event2) => {
    try {
      const higherPriorityEvent = event1.priority >= event2.priority ? event1 : event2;
      const lowerPriorityEvent = event1.priority >= event2.priority ? event2 : event1;
  
      // Calculate new time for lower priority event
      let newStartTime = moment(higherPriorityEvent.end);
      const duration = moment(lowerPriorityEvent.end).diff(moment(lowerPriorityEvent.start), 'minutes');
      let newEndTime = newStartTime.clone().add(duration, 'minutes');
  
      // Check if the new time slot is free
      const furtherConflicts = checkForConflicts(newStartTime, newEndTime)
        .filter(e => e._id !== lowerPriorityEvent._id);
  
      // If there are further conflicts, try to find the next available slot
      if (furtherConflicts.length > 0) {
        const latestEndTime = moment.max(furtherConflicts.map(e => moment(e.end)));
        newStartTime = latestEndTime;
        newEndTime = newStartTime.clone().add(duration, 'minutes');
      }
  
      const updatedEvent = {
        ...lowerPriorityEvent,
        start: newStartTime.toDate(),
        end: newEndTime.toDate()
      };
  
      const response = await axios.put(
        `http://localhost:3000/api/calendar/events/${lowerPriorityEvent._id}`,
        updatedEvent
      );
  
      // Update local state
      setEvents(prevEvents => {
        const updatedEvents = prevEvents.map(event =>
          event._id === lowerPriorityEvent._id ? response.data : event
        );
        return updatedEvents;
      });
  
      // Add the rescheduled event to state with its message
      setRescheduledEvents(prev => ({
        ...prev,
        [lowerPriorityEvent._id]: {
          message: `Rescheduled to ${newStartTime.format('h:mm A')}`,
          timestamp: Date.now()
        }
      }));
  
      fetchWeeklyEvents();
    } catch (error) {
      console.error("Failed to manage conflicts:", error);
      showAlert("Failed to manage conflicts", "error");
    }
  };

 // Update the WeeklyEventCard component
const WeeklyEventCard = ({ event, dayEvents }) => {
  const conflicts = checkForConflicts(moment(event.start), moment(event.end))
    .filter(e => e._id !== event._id)
    .sort((a, b) => b.priority - a.priority);

  const isRescheduled = rescheduledEvents[event._id];
  const hasActiveConflicts = conflicts.length > 0 && !isRescheduled;

  return (
    <div className={`p-3 rounded-lg border space-y-1 ${
      hasActiveConflicts ? 'bg-red-50 border-red-200' : 
      isRescheduled ? 'bg-green-50 border-green-200' : 
      'bg-blue-50 border-blue-100'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-blue-900">{event.title}</div>
          <div className="text-sm text-blue-600">
            {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
          </div>
          <div className="text-xs text-gray-600">
            Priority: {event.priority}
          </div>
        </div>
        {isRescheduled && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
            {isRescheduled.message}
          </span>
        )}
      </div>

      {event.productivity && (
        <div className="text-xs space-x-2">
          <span className={`inline-block px-2 py-1 rounded ${
            event.productivity >= 7 ? 'bg-green-100 text-green-700' :
            event.productivity >= 4 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            P: {event.productivity.toFixed(1)}
          </span>
          <span className={`inline-block px-2 py-1 rounded ${
            event.satisfaction >= 7 ? 'bg-green-100 text-green-700' :
            event.satisfaction >= 4 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            S: {event.satisfaction.toFixed(1)}
          </span>
        </div>
      )}

      {hasActiveConflicts && (
        <div className="mt-2">
          <span className="text-xs text-red-600 font-medium">
            Conflicts with: {conflicts.map(e => `${e.title} (Priority: ${e.priority})`).join(', ')}
          </span>
          <button
            onClick={() => handleSmartManage(event, conflicts[0])}
            className="mt-1 w-full text-xs py-1 px-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Manage Schedule Conflict
          </button>
        </div>
      )}
    </div>
  );
};

  const fetchWeeklyEvents = () => {
    const startOfWeek = moment(selectedDate).startOf('week');
    const endOfWeek = moment(selectedDate).endOf('week');

    const weekEvents = events.filter(event => {
      const eventDate = moment(event.start);
      return eventDate.isBetween(startOfWeek, endOfWeek, 'day', '[]');
    });

    const sortedEvents = Array(7).fill([]).map((_, index) => {
      const day = moment(startOfWeek).add(index, 'days');
      const dayEvents = weekEvents.filter(event =>
        moment(event.start).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
      );
      return {
        date: day,
        events: dayEvents
      };
    });

    setWeeklyEvents(sortedEvents);
  };

  const handleDeleteEvent = async () => {
    const existingEvent = events.find(
      (event) => moment(event.start).format("YYYY-MM-DD") === moment(selectedDate).format("YYYY-MM-DD")
    );

    if (!existingEvent) {
      showAlert("No event found to delete", "error");
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/calendar/events/${existingEvent._id}`);
      console.log(existingEvent._id);
      setEvents(events.filter((event) => event._id !== existingEvent._id));
      setEventDetails({
        title: "",
        event_type: "work",
        duration: 60,
        energy_level: 5,
        priority: 5,
        intensity: 5,
        flexibility: 5,
        location: "office",
        start: new Date(),
        end: new Date()
      });
      showAlert("Event deleted successfully", "success");
    } catch (error) {
      showAlert("Failed to delete event", "error");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-center items-start w-full max-w-7xl gap-8">
        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">ML Calendar</h2>
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileClassName={({ date }) =>
              events.some((event) =>
                moment(event.start).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
              )
                ? "bg-blue-500 text-white rounded-full hover:bg-blue-600"
                : "hover:bg-gray-100"
            }
            className="w-full border-0 rounded-xl shadow-sm"
          />
        </div> 

        {/* Event Form Section */}
        <div className="w-full md:w-96 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Add Event</h3>

          <div className="space-y-6">
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={eventDetails.title}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
            />

            <select
              name="event_type"
              value={eventDetails.event_type}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
            >
              <option value="work">Work</option>
              <option value="meeting">Meeting</option>
              <option value="social">Social </option>
              <option value="self-care">Self - care</option>
            </select>

            <div className="grid grid-cols-2 gap-6">
              {/* Input fields remain the same but with updated styling */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Priority (1-10)</label>
                <input
                  type="number"
                  name="priority"
                  min="1"
                  max="10"
                  value={eventDetails.priority}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">How flexible is it to reschedule?(1-10)</label>
                <input
                  type="number"
                  name="flexibility"
                  min="1"
                  max="10"
                  value={eventDetails.flexibility}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">How energetic do you feel?(1-10)</label>
                <input
                  type="number"
                  name="energy_level"
                  min="1"
                  max="10"
                  value={eventDetails.energy_level}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
                />
              </div>

              
            </div>

            <select
              name="location"
              value={eventDetails.location}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
            >
              <option value="office">Office</option>
              <option value="home">Home</option>
              <option value="outside">Outside</option>
            </select>

            {/* Centered Buttons with new styling */}
            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={handleFindBestSlot}
                className="w-full py-3 bg-white border-2 border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Find Best Slot using AI
              </button>
              <button
                onClick={applyToSchedule}
                className="w-full py-3 bg-white border-2 border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Apply to Schedule
              </button>
              <button
                onClick={handleDeleteEvent}
                className="w-full py-3 bg-white border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Delete Event
              </button>
            </div>
          </div>
          {/* ML Predictions Section */}
          {mlPredictions && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="text-lg font-bold mb-4 text-gray-800">ML Suggestions</h4>
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span className="text-gray-600">Optimal Time:</span>
                  <span className="font-medium">{mlPredictions.optimal_hour}:00</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Suggested Duration:</span>
                  <span className="font-medium">{mlPredictions.suggested_duration} minutes</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Predicted Productivity:</span>
                  <span className={`font-medium ${mlPredictions.predicted_productivity >= 7 ? 'text-green-600' :
                      mlPredictions.predicted_productivity >= 4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {mlPredictions.predicted_productivity.toFixed(2)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Predicted Satisfaction:</span>
                  <span className={`font-medium ${mlPredictions.predicted_satisfaction >= 7 ? 'text-green-600' :
                      mlPredictions.predicted_satisfaction >= 4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {mlPredictions.predicted_satisfaction.toFixed(2)}
                  </span>
                </p>
                {mlPredictions.energy_flexibility_score && (
                  <p className="flex justify-between">
                    <span className="text-gray-600">Energy-Flexibility Score:</span>
                    <span className={`font-medium ${mlPredictions.energy_flexibility_score >= 7 ? 'text-green-600' :
                        mlPredictions.energy_flexibility_score >= 4 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {mlPredictions.energy_flexibility_score.toFixed(2)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          
          {/* Alert styling */}
          {alert.show && (
            <div
              className={`mt-6 p-4 rounded-lg text-center font-medium ${alert.type === "success" ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {alert.message}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Schedule Section with enhanced table styling */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-8 w-full max-w-7xl">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Weekly Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Day</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {weeklyEvents.map((dayData, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {dayData.date.format('dddd')}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {dayData.date.format('MMM D, YYYY')}
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  {dayData.events.map((event, eventIndex) => (
                    <WeeklyEventCard
                      key={eventIndex}
                      event={event}
                      dayEvents={dayData.events}
                    />
                  ))}
                  {dayData.events.length === 0 && (
                    <div className="text-gray-400 italic">No events</div>
                  )}
                </div>
              </td>
            </tr>
          ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MLCalendar;