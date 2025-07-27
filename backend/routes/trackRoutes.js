const express = require("express");
const { trackTime } = require("../controllers/trackController");
const router = express.Router();

router.post("/track-time", trackTime);

module.exports = router;
