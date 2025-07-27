const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  event_type: {
    type: String,
    enum: ['work', 'meeting', 'social', 'self-care'],
    default: 'work'
  },
  type: {
    type: String,
    enum: ['work', 'meeting', 'social', 'self-care'],
    default: 'work'
  },
  duration: {
    type: Number,
    default: 60
  }, 
  energy_level: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  flexibility: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  location: {
    type: String,
    enum: ['office', 'home', 'outside'],
    default: 'office'
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  productivity: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  satisfaction: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  optimal_hours: {
    type: Number,
    default: 0
  },
  energy_flexibility_score: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  }
});

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);