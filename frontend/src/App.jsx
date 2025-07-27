import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import Landing from "./Landing/Landing";
import CognitiveLoadPredictor from "./CognitiveEngagement/CognitiveLoadPredictor";
import MLCalendar from "./Calender/MLCalender";
import SocialNetwork from "./SocialNetwork/SocialNetwork";
import ChatApp from "./Counselor/ChatApp";
import TrendAnalysis from "./TrenAnalysis/TrendAnalysis";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/counselor" element={<ChatApp/>} />
        <Route path="/calendar" element={<MLCalendar />} />
        <Route path="/SocialNetwork" element={<SocialNetwork />} />
        <Route path="/cognition" element={<CognitiveLoadPredictor />} />
        <Route path="/trend" element={<TrendAnalysis/>} />
      </Routes>

      {/* <Footer /> */}
    </Router>
  );
}

export default App;
