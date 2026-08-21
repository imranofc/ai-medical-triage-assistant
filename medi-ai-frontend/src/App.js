import Home from "./pages/Home/Home.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import NewConsultation from "./pages/NewConsultation/NewConsultation.jsx";
import "./App.css";
import Details from "./pages/Details/Details.jsx";
import Review from "./pages/ConsultationReview/Review.jsx";
import AIAnalysis from "./pages/AIAnalysis/AIAnalysis.jsx";
import AnalysisDetails from "./pages/AIAnalysis/AnalysisDetails.jsx";
import WarningDetails from "./pages/AIAnalysis/WarningDetails.jsx";
import SelfCareDetails from "./pages/AIAnalysis/SelfCareDetails.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new-consultation" element={<NewConsultation />} />
        <Route path="/new-consultation/details" element={<Details />} />
        <Route path="/new-consultation/review" element={<Review />} />
        <Route path="/new-consultation/analysis" element={<AIAnalysis />} />
        <Route path="/new-consultation/analysis/details" element={<AnalysisDetails />} />
        <Route path="/new-consultation/analysis/warnings" element={<WarningDetails />} />
        <Route path="/new-consultation/analysis/self-care" element={<SelfCareDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;