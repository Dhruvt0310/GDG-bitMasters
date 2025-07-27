// src/UserForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import './SocialNetwork.css';
import { Scatter, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement } from 'chart.js';
import useUserData from './useUserData'; // Import the custom hook

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement);

const SocialNetwork = () => {
  const [formData, setFormData] = useState({
    age: "21",
    gender: "Female",
    time_spent: "",
    platform: "Instagram",
    interests: "Sports",
    location: "Australia",
    demographics: "Urban",
    profession: "Student",
    income: "10000",
    indebt: false,
    isHomeOwner: false,
    Owns_Car: false,
  });

  const [result, setResult] = useState(null);
  const [scatterData, setScatterData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const users = useUserData('/path/to/user_activities_with_names.csv'); // Use the custom hook

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting data:", formData); // Debug log
    try {
      const response = await fetch("http://127.0.0.1:5000/clusters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data); // Debug log
      setResult(data);

      // Prepare data for scatter plot
      const scatterX = [];
      const scatterY = [];
      const clusterCounts = {};
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; // Define colors for clusters

      Object.entries(data).forEach(([cluster, { names, prominent_feature }]) => {
        // Limit to 10 names per cluster
        const limitedNames = names.slice(0, 10);
        limitedNames.forEach((name, index) => {
          const coordinates = getCoordinatesForName(name); // Implement this function
          scatterX.push(coordinates.x);
          scatterY.push(coordinates.y);
        });
        clusterCounts[cluster] = limitedNames.length;
      });

      setScatterData({
        labels: scatterX,
        datasets: [
          {
            label: 'Clusters',
            data: scatterY.map((y, index) => ({ x: scatterX[index], y })),
            backgroundColor: colors.slice(0, Object.keys(data).length), // Use different colors for each cluster
          },
        ],
      });

      // Prepare data for pie chart
      setPieData({
        labels: Object.keys(clusterCounts),
        datasets: [
          {
            data: Object.values(clusterCounts),
            backgroundColor: colors.slice(0, Object.keys(clusterCounts).length),
          },
        ],
      });

    } catch (error) {
      console.error("Error:", error);
      setResult(null);
    }
  };

  const getCoordinatesForName = (name) => {
    // Placeholder function to get coordinates for each name
    // Replace this with actual logic to retrieve coordinates based on your data
    return { x: Math.random() * 100, y: Math.random() * 100 }; // Example random coordinates
  };

  return (
    <div className="social-network-container">
      <div className="form-card">
        <h1>Social Network Analysis</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>
            <div className="form-group">
              <label>Average Time Spent on Socials:</label>
              <input
                type="number"
                name="time_spent"
                value={formData.time_spent}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Platform:</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
              </select>
            </div>
            <div className="form-group">
              <label>Interests:</label>
              <select
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Sports">Sports</option>
                <option value="Travel">Travel</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location:</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="United States">United States</option>
              </select>
            </div>
            <div className="form-group">
              <label>Demographics:</label>
              <select
                name="demographics"
                value={formData.demographics}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Urban">Urban</option>
                <option value="Sub_Urban">Sub_Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
            <div className="form-group">
              <label>Profession:</label>
              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Student">Student</option>
                <option value="Marketer Manager">Marketer Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label>Income:</label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="checkbox-grid">
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="indebt"
                  checked={formData.indebt}
                  onChange={handleChange}
                />
                In Debt
              </label>
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isHomeOwner"
                  checked={formData.isHomeOwner}
                  onChange={handleChange}
                />
                Is Home Owner
              </label>
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="Owns_Car"
                  checked={formData.Owns_Car}
                  onChange={handleChange}
                />
                Owns Car
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">Analyze Profile</button>
        </form>
      </div>

      {result && (
        <div className="result-card">
          <h2>Cluster Results</h2>
          {Object.entries(result).map(([cluster, { names, prominent_feature }]) => (
            <div key={cluster} className="result-section">
              <h3 className="highlight">Cluster {cluster}</h3>
              {/* <p>Most Prominent Feature: <strong>{prominent_feature}</strong></p> */}
              <ul className="result-list">
                {names.slice(0, 10).map((name, index) => (
                  <li key={index} className="user-item">
                    <Link to={`/user/${name}`}>{name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="charts-container">
            <h2>Cluster Visualizations</h2>
            {scatterData && (
              <div className="chart-box">
                <h3>Scatter Plot of Clusters</h3>
                <Scatter data={scatterData} options={{ responsive: true }} />
              </div>
            )}
            {/* {pieData && (
              <div className="chart-box">
                <h3>Cluster Distribution Pie Chart</h3>
                <Pie data={pieData} options={{ responsive: true }} />
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
    // </div>
    // </>
  );
};

export default SocialNetwork;
