const express = require("express");
const {
  getEvents,
  addEvent,
  editEvent,
  deleteEvent,
} = require("../controllers/calendarController");

const router = express.Router();

router.get("/events", getEvents);
router.post("/events/add", addEvent);
router.put("/events/:id", editEvent);
router.delete("/events/:id", deleteEvent);

module.exports = router;
