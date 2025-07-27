import React, { useState } from 'react';
import axios from 'axios';
import './CognitiveLoadPredictor.css';

const CognitiveLoadPredictor = () => {
  const initialFormState = {
    duration: '',
    engagement_level: '',
    event_type: '',
    location: '',
    time_of_day: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [comparisonData, setComparisonData] = useState(null);
  const [secondComparisonData, setSecondComparisonData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showSecondComparison, setShowSecondComparison] = useState(false);

  const handleInputChange = (e, scenarioNumber = 0) => {
    const { name, value } = e.target;
    
    switch(scenarioNumber) {
      case 1:
        setComparisonData(prev => ({
          ...prev,
          [name]: value
        }));
        break;
      case 2:
        setSecondComparisonData(prev => ({
          ...prev,
          [name]: value
        }));
        break;
      default:
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const requestData = {
      ...formData,
      comparison: comparisonData
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/cogPredict', requestData);
      setPrediction(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while making the prediction');
    }
    setLoading(false);
  };

  const toggleSecondComparison = () => {
    if (!showSecondComparison) {
      setSecondComparisonData({...initialFormState});
    } else {
      setComparisonResults(null);
      setSecondComparisonData(null);
    }
    setShowSecondComparison(!showSecondComparison);
  };

  const handleComparisonAnalysis = async () => {
    if (!formData || !secondComparisonData) {
      alert('Please enter both comparison scenarios');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/compareScenarios', {
        scenario1: formData,
        scenario2: secondComparisonData
      });
      setComparisonResults(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while comparing scenarios');
    }
    setLoading(false);
  };

  const generateRiskFactors = (data) => {
    const riskFactors = [];
    
    // Duration analysis
    const duration = parseInt(data.duration);
    if (duration <= 30) {
      riskFactors.push({
        factor: 'Duration',
        value: `${duration} minutes`,
        risk_level: 'Low',
        impact: 'Short duration promotes good focus and minimal cognitive load'
      });
    } else if (duration <= 60) {
      riskFactors.push({
        factor: 'Duration',
        value: `${duration} minutes`,
        risk_level: 'Moderate',
        impact: 'Moderate duration may require breaks'
      });
    }

    // Engagement level analysis
    const engagement = parseInt(data.engagement_level);
    if (engagement <= 3) {
      riskFactors.push({
        factor: 'Engagement',
        value: `Level ${engagement}`,
        risk_level: 'Low',
        impact: 'Low engagement level indicates minimal cognitive demand'
      });
    } else if (engagement <= 6) {
      riskFactors.push({
        factor: 'Engagement',
        value: `Level ${engagement}`,
        risk_level: 'Moderate',
        impact: 'Moderate engagement requires balanced attention'
      });
    }

    // Event type analysis
    const eventImpact = {
      'meeting': 'Regular meetings have predictable cognitive demands',
      'exercise': 'Physical activity can help reduce mental stress',
      'break': 'Breaks are essential for cognitive recovery',
      'social_interaction': 'Social interactions require emotional energy',
      'commute': 'Commuting adds to daily cognitive load',
      'casual_lunch': 'Casual breaks help in mental recovery'
    };

    riskFactors.push({
      factor: 'Event Type',
      value: data.event_type,
      risk_level: 'Low',
      impact: eventImpact[data.event_type] || 'Standard cognitive load for this activity'
    });

    return riskFactors;
  };

  const generateRecommendations = (data, riskScore) => {
    const recommendations = [];
    const duration = parseInt(data.duration);
    const engagement = parseInt(data.engagement_level);

    recommendations.push(
      "Take regular breaks to maintain cognitive freshness",
      "Stay hydrated throughout the activity",
      "Practice mindful breathing if feeling overwhelmed",
      "Minimize digital distractions by turning off notifications",
      "Implement quick stretching exercises between tasks",
      "Practice the 20-20-20 rule for eye strain prevention",
      "Maintain good posture to reduce physical stress",
      "Create a structured to-do list to manage tasks effectively",
      "Take short walks to refresh your mind",
      "Use noise-canceling headphones if environment is distracting",
      "Schedule complex tasks during your peak energy hours"
    );

    if (duration <= 30) {
      recommendations.push(
        "Make the most of this focused time period",
        "Set clear goals for this short session"
      );
    }

    if (engagement <= 3) {
      recommendations.push(
        "Consider ways to maintain optimal engagement",
        "Use this low-intensity period for planning or reflection"
      );
    }

    return recommendations;
  };

  const renderInputForm = (data, isComparison = false) => (
    <div className={`input-form ${isComparison ? 'comparison-form' : ''}`}>
      <h3>{isComparison ? 'Comparison Scenario' : 'Current Scenario'}</h3>
      <div className="form-group">
        <label htmlFor={`duration${isComparison ? '-comp' : ''}`}>Duration (minutes)</label>
        <input
          id={`duration${isComparison ? '-comp' : ''}`}
          type="number"
          name="duration"
          value={data.duration}
          onChange={(e) => handleInputChange(e, isComparison ? 2 : 0)}
          required
          min="1"
          max="480"
        />
      </div>

      <div className="form-group">
        <label htmlFor={`engagement_level${isComparison ? '-comp' : ''}`}>How engaging is your work nowadays?(1-10)</label>
        <input
          id={`engagement_level${isComparison ? '-comp' : ''}`}
          type="number"
          name="engagement_level"
          value={data.engagement_level}
          onChange={(e) => handleInputChange(e, isComparison ? 2 : 0)}
          required
          min="1"
          max="10"
        />
      </div>

      <div className="form-group">
        <label htmlFor={`event_type${isComparison ? '-comp' : ''}`}>Event Type</label>
        <select
          id={`event_type${isComparison ? '-comp' : ''}`}
          name="event_type"
          value={data.event_type}
          onChange={(e) => handleInputChange(e, isComparison ? 2 : 0)}
        >
          <option value="">Select Event Type</option>
          <option value="meeting">Meeting</option>
          <option value="exercise">Exercise</option>
          <option value="break">Break</option>
          <option value="social_interaction">Social Interaction</option>
          <option value="commute">Commute</option>
          <option value="casual_lunch">Casual Lunch</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor={`location${isComparison ? '-comp' : ''}`}>Location</label>
        <select
          id={`location${isComparison ? '-comp' : ''}`}
          name="location"
          value={data.location}
          onChange={(e) => handleInputChange(e, isComparison ? 2 : 0)}
        >
          <option value="">Select Location</option>
          <option value="office">Office</option>
          <option value="home">Home</option>
          <option value="gym">Gym</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor={`time_of_day${isComparison ? '-comp' : ''}`}>Time of Day</label>
        <select
          id={`time_of_day${isComparison ? '-comp' : ''}`}
          name="time_of_day"
          value={data.time_of_day}
          onChange={(e) => handleInputChange(e, isComparison ? 2 : 0)}
        >
          <option value="">Select Time of Day</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>
    </div>
  );

  const renderPredictionResults = (predictionData, isComparison = false) => (
    <div className="prediction-results">
      <h3>{isComparison ? 'Comparison Analysis' : 'Current Analysis'}</h3>
      
      <div className="result-card risk-score-card">
        <div className="probability-indicator" 
             style={{
               backgroundColor: predictionData.analysis.risk_score > 75 ? '#ff4d4d' : 
                              predictionData.analysis.risk_score > 50 ? '#ffd700' : '#4CAF50',
               opacity: Math.max(predictionData.analysis.risk_score / 100, 0.3)
             }}>
          <span className="probability">
            Risk Score: {predictionData.analysis.risk_score}%
          </span>
          <span className="risk-level">
            Risk Level: {predictionData.analysis.risk_level}
          </span>
        </div>
      </div>
      <div className="result-card risk-factors-card">
        <h4>Risk Factors</h4>
        <div className="factors-grid">
          {predictionData.analysis.risk_factors.map((factor, index) => (
            <div key={index} className="factor-item">
              <div className="factor-header">
                <span className="factor-name">{factor.factor}</span>
                <span className={`risk-badge ${factor.risk_level.toLowerCase()}`}>
                  {factor.risk_level}
                </span>
              </div>
              <div className="factor-value">{factor.value}</div>
              <div className="factor-impact">{factor.impact}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="result-card recommendations-card">
        <h4>Smart Recommendations </h4>
        <div className="recommendations-grid">
          {predictionData.analysis.recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <div className="recommendation-number">{index + 1}</div>
              <div className="recommendation-text">{rec}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderComparisonResults = () => {
    if (!comparisonResults) return null;

    return (
      <div className="comparison-results-container">
        <h3>Scenario Comparison Analysis</h3>
        
        <div className="comparison-grid">
          <div className="comparison-column">
            <h4>Scenario 1</h4>
            {/* <div className="risk-score">
              Risk Score: {comparisonResults.scenario1.risk_score}%
            </div> */}
            <div className="comparison-details">
              {Object.entries(comparisonResults.scenario1.details).map(([key, value]) => (
                <div key={key} className="comparison-detail-item">
                  <span className="detail-label">{key}:</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="comparison-column">
            <h4>Scenario 2</h4>
            {/* <div className="risk-score">
              Risk Score: {comparisonResults.scenario2.risk_score}%
            </div> */}
            <div className="comparison-details">
              {Object.entries(comparisonResults.scenario2.details).map(([key, value]) => (
                <div key={key} className="comparison-detail-item">
                  <span className="detail-label">{key}:</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="comparison-analysis">
          <h4>Analysis</h4>
          <div className="analysis-card">
            <div className="difference-metrics">
              {comparisonResults.differences.map((diff, index) => (
                <div key={index} className="difference-item">
                  <span className="difference-label">{diff.factor}:</span>
                  <span className="difference-value">{diff.impact}</span>
                </div>
              ))}
            </div>
            <div className="recommendations">
              <h5>Recommendations</h5>
              <ul>
                {comparisonResults.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#b7b7b7]">
      <div className="predictor-container">
      <div className="predictor-card">
        <h2>Cognitive Load Predictor</h2>
        
        <div className="primary-analysis">
          <form onSubmit={handleSubmit}>
            {renderInputForm(formData)}
            <button type="submit" className="predict-button" disabled={loading}>
              {loading ? 'Analyzing...' : 'Generate Analysis using Deep Learning'}
            </button>
          </form>

          {prediction && (
            <div className="results-container">
              {renderPredictionResults(prediction.current)}
            </div>
          )}
        </div>

        <div className="comparison-section">
          <h3>Want to compare with another scenario?</h3>
          <button 
            type="button" 
            onClick={toggleSecondComparison} 
            className="comparison-toggle"
          >
            {showSecondComparison ? 'Remove Comparison' : 'Add Comparison Scenario'}
          </button>
          
          {showSecondComparison && (
            <>
              <div className="comparison-forms">
                {renderInputForm(secondComparisonData, true)}
              </div>
              <button 
                type="button" 
                onClick={handleComparisonAnalysis} 
                className="compare-button"
                disabled={loading}
              >
                {loading ? 'Comparing...' : 'Compare Scenarios'}
              </button>
            </>
          )}

          {comparisonResults && renderComparisonResults()}
        </div>
      </div>
    </div>
    </div>
  );
};

export default CognitiveLoadPredictor;