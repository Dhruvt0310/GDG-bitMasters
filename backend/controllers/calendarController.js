const CalendarEvent = require("../models/calendarModel");

exports.getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find();
    // console.log("getEvents : " , events);
    res.json(events); 
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching events" });
  }
};

exports.addEvent = async (req, res) => {
  try {
    console.log("Received event data:", req.body);
    const { 
      title, 
      start, 
      end, 
      event_type,
      duration,
      energy_level,
      priority,
      intensity,
      flexibility,
      location,
      productivity,
      satisfaction,
      type,
      optimal_hour,
      energy_flexibility_score
    } = req.body;

    const newEvent = new CalendarEvent({ 
      title, 
      start, 
      end,
      event_type,
      duration,
      energy_level,
      priority,
      intensity,
      flexibility,
      location,
      productivity: productivity / 10, // Convert to 0-1 range
      satisfaction: satisfaction / 10, // Convert to 0-1 range
      type,
      optimal_hours: optimal_hour, // Match the schema field name
      energy_flexibility_score: energy_flexibility_score / 10 // Convert to 0-1 range
    });

    const savedEvent = await newEvent.save();
    console.log("Event saved successfully:", savedEvent);
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ 
      error: "Error creating event", 
      details: error.message 
    });
  }
};

exports.editEvent = async (req, res) => {
  try {
    console.log(req.params)
    const { id } = req.params;
    const { 
      title, 
      start, 
      end,
      event_type,
      duration,
      energy_level,
      priority,
      intensity,
      flexibility,
      location,
      productivity,
      satisfaction
    } = req.body;

    const updatedEvent = await CalendarEvent.findByIdAndUpdate(
      id,
      { 
        title, 
        start, 
        end,
        event_type,
        duration,
        energy_level,
        priority,
        intensity,
        flexibility,
        location,
        productivity,
        satisfaction
      },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Error updating event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    await CalendarEvent.findByIdAndDelete(id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting event" });
  }
};