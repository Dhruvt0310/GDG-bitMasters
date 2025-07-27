import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// import { Card, CardContent } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const categories = ['Education', 'Entertainment', 'Gaming', 'Music', 'News', 'Others'];
const timeOfDay = ['Morning', 'Afternoon', 'Evening', 'Night'];
const ageGroups = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'];

function TrendAnalysis() {
  // Form and prediction states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
    watch_duration: '',
    video_length: '',
    timestamp: new Date().toISOString().slice(0, 16),
    time_of_day: 'Morning',
    viewer_age_group: '18-24'
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Time tracking states
  const [timeTrackingData, setTimeTrackingData] = useState([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState({
    youtube: 0,
    shorts: 0,
    instagram: 0
  });
  const [extensionConnected, setExtensionConnected] = useState(false);

  useEffect(() => {
    console.log('Setting up extension message listeners...');
    
    const handleExtensionMessage = (event) => {
      if (event.source === window && event.data.type === 'FROM_EXTENSION') {
        console.log('Received data from extension:', event.data);
        setExtensionConnected(true);
        processTimeTrackingData(event.data.timeData);
      }
    };

    window.addEventListener('message', handleExtensionMessage);

    // Request initial data
    console.log('Requesting initial time data...');
    window.postMessage({ type: 'REQUEST_TIME_DATA' }, '*');

    // Set up periodic data requests
    const intervalId = setInterval(() => {
      window.postMessage({ type: 'REQUEST_TIME_DATA' }, '*');
    }, 30000); // Request updates every 30 seconds

    return () => {
      window.removeEventListener('message', handleExtensionMessage);
      clearInterval(intervalId);
    };
  }, []);

  const processTimeTrackingData = (data) => {
    console.log('Processing time tracking data:', data);
    
    if (!data) {
      console.warn('No time tracking data received');
      return;
    }

    try {
      const processedData = Object.entries(data).map(([date, sites]) => ({
        date,
        Youtube: sites['youtube.com'] ? Math.round(sites['youtube.com'] / 60000) : 0,
        'Youtube Shorts': sites['youtube.com/shorts'] ? Math.round(sites['youtube.com/shorts'] / 60000) : 0,
        Instagram: sites['instagram.com'] ? Math.round(sites['instagram.com'] / 60000) : 0
      }));

      console.log('Processed time tracking data:', processedData);
      setTimeTrackingData(processedData);

      // Calculate totals
      const totals = processedData.reduce((acc, day) => ({
        youtube: acc.youtube + day.Youtube,
        shorts: acc.shorts + day['Youtube Shorts'],
        instagram: acc.instagram + day.Instagram
      }), { youtube: 0, shorts: 0, instagram: 0 });

      setTotalTimeSpent(totals);
      console.log('Updated total time spent:', totals);
    } catch (err) {
      console.error('Error processing time data:', err);
      setError('Error processing time tracking data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting form data:', formData);
      const response = await axios.post('http://127.0.0.1:5000/smmpredict', formData);
      console.log('Prediction response:', response.data);
      setPrediction(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeTrackingChartData = {
    labels: timeTrackingData.map(item => item.date),
    datasets: [
      {
        label: 'YouTube',
        data: timeTrackingData.map(item => item.Youtube),
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
      },
      {
        label: 'YouTube Shorts',
        data: timeTrackingData.map(item => item['Youtube Shorts']),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
      },
      {
        label: 'Instagram',
        data: timeTrackingData.map(item => item.Instagram),
        borderColor: 'rgb(131, 58, 180)',
        backgroundColor: 'rgba(131, 58, 180, 0.1)',
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Extension Status */}
      {!extensionConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="text-yellow-700">
            Extension not detected. Please make sure the Social Media Time Tracker extension is installed and enabled.
          </div>
        </div>
      )}

      {/* Time Tracking Section */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Social Media Time Tracking
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Time on YouTube</h3>
              <div className="text-3xl font-bold text-red-600">
                {totalTimeSpent.youtube} mins
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Time on Shorts</h3>
              <div className="text-3xl font-bold text-pink-600">
                {totalTimeSpent.shorts} mins
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Time on Instagram</h3>
              <div className="text-3xl font-bold text-purple-600">
                {totalTimeSpent.instagram} mins
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Line
              data={timeTrackingChartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Daily Social Media Usage',
                    font: { size: 16, weight: 'bold' }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Minutes'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Trend Analysis Form */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Content Performance Predictor
          </h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="text-red-700">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter content title"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter content description"
                  rows="4"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time of Day</label>
                <select
                  value={formData.time_of_day}
                  onChange={(e) => setFormData({...formData, time_of_day: e.target.value})}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {timeOfDay.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Watch Duration (seconds)</label>
                <input
                  type="number"
                  value={formData.watch_duration}
                  onChange={(e) => setFormData({...formData, watch_duration: e.target.value})}
                  min="0"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Length (seconds)</label>
                <input
                  type="number"
                  value={formData.video_length}
                  onChange={(e) => setFormData({...formData, video_length: e.target.value})}
                  min="0"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                <input
                  type="datetime-local"
                  value={formData.timestamp}
                  onChange={(e) => setFormData({...formData, timestamp: e.target.value})}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Age Group</label>
                <select
                  value={formData.viewer_age_group}
                  onChange={(e) => setFormData({...formData, viewer_age_group: e.target.value})}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {ageGroups.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? 'Analyzing...' : 'Predict Engagement'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Prediction Results */}
      {prediction && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Likes</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {prediction.likes}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Shares</h3>
                <div className="text-3xl font-bold text-green-600">
                  {prediction.shares}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Watch Ratio</h3>
                <div className="text-3xl font-bold text-purple-600">
                  {(prediction.watch_ratio * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Engagement Score</h3>
                <div className="text-3xl font-bold text-yellow-600">
                  {(prediction.engagement_score * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Overall engagement prediction based on all factors
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Sentiment Analysis</h3>
                <div className="text-3xl font-bold text-indigo-600">
                  {(prediction.sentiment_score * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Content sentiment positivity score
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <Line
                data={{
                  labels: ['Engagement', 'Sentiment', 'Watch Ratio'],
                  datasets: [{
                    label: 'Content Performance Metrics',
                    data: [
                      prediction.engagement_score,
                      prediction.sentiment_score,
                      prediction.watch_ratio
                    ],
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.1
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Content Performance Analysis',
                      font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                      position: 'bottom'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 1,
                      ticks: {
                        callback: value => `${(value * 100).toFixed(0)}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrendAnalysis;