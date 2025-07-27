const TimeLog = require("../models/shortsWatchTimeModel");

exports.trackTime = async (req, res) => {
    try {
        console.log("Received raw data:", req.body);
        const { timeSpent, videoData } = req.body;

        // Handle time data
        if (timeSpent) {
            console.log("Time data received:", timeSpent);
            const timeLog = new TimeLog({ timeSpent });
            await timeLog.save();
        }

        // Handle video data
        if (videoData) {
            console.log("Video data received:", videoData);
            const videoLog = new TimeLog({ videoData });
            await videoLog.save();
        }

        res.json({ 
            message: "Data logged successfully",
            timeSpent,
            videoData
        });
    } catch (err) {
        console.error("Error saving data:", err);
        res.status(500).json({ error: err.message });
    }
};