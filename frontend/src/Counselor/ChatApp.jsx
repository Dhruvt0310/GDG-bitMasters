/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import Loader from "./Loader.jsx";
import "./ChatApp.css";

function App() {
  // Base URL of your FastAPI backend
  const BASE_URL = "http://localhost:5000";

  // State for Audio File Upload
  const [file, setFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);

  // State for Therapy Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Handle sending chat message via Axios HTTP POST
  const sendChatMessage = async () => {
    if (chatInput.trim() === "") return;
    const userMessage = chatInput;
    // Append user's message to chat window
    setChatMessages((prev) => [...prev, { sender: "You", text: userMessage }]);
    setChatInput("");

    try {
      // Send message to backend therapy chat endpoint
      const response = await axios.post(`${BASE_URL}/therapy_chat`, {
        message: userMessage,
      });
      // Destructure the response using the correct fields from TherapyResponse
      const { text: therapistResponse, suggestions } = response.data;
      // Build a message string including suggestions if available
      const suggestionText =
        suggestions && suggestions.length > 0
          ? `\nSuggestions: ${suggestions.join(", ")}`
          : "";
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "Therapist",
          text: therapistResponse + suggestionText,
        },
      ]);
    } catch (error) {
      console.error("Error sending chat message:", error);
      setChatMessages((prev) => [
        ...prev,
        { sender: "Therapist", text: "Error connecting to server." },
      ]);
    }
  };

  // Handle file selection for audio upload
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle audio file upload using Axios
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${BASE_URL}/upload_audio`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadResponse(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (<>
    <div className="chatappbody">
      <div className="chatapp-container w-full">
      <h1 className="chatapp-h1">AI Therapist Frontend</h1>

      <div className="section">
        <h2>Therapy Chat</h2>
        <div className="chat-window">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
          />
          <button onClick={sendChatMessage}>Send</button>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}

export default App;
