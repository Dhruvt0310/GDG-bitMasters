const mongoose = require('mongoose');

const ShortsWatchTimeSchema = new mongoose.Schema({
    timeSpent: { type: Number, required: true, default: 0 },
    videoData: {
        title: String,
        description: String,
        channel: String,
        likes: String,
        url: String,
        timestamp: Date
    },
    mlAnalysis: {
        mood: String,
        contentCategory: String,
        engagementScore: Number,
        topics: [String],
        sentiment: Number
    },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ShortsWatchTime", ShortsWatchTimeSchema);
