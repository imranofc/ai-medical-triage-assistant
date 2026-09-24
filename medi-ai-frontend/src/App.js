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
import History from "./pages/History/History.jsx";
import HowItWorks from "./pages/InfoPages/HowItWorks";
import Safety from "./pages/InfoPages/Safety";
import Features from "./pages/InfoPages/Features";
import FAQs from "./pages/InfoPages/FAQs";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import DashboardMenu from "./components/DashboardMenu/DashboardMenu.jsx";
import { Outlet } from "react-router-dom";

function PublicLayout(){
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        </Route>

        <Route element={<DashboardMenu />}>
        <Route path="/history" element={<History />} />
        <Route path="/new-consultation/details" element={<Details />} />
        <Route path="/new-consultation/review" element={<Review />} />
        <Route path="/new-consultation/analysis" element={<AIAnalysis />} />
        <Route path="/new-consultation/analysis/details" element={<AnalysisDetails />} />
        <Route path="/new-consultation/analysis/warnings" element={<WarningDetails />} />
        <Route path="/new-consultation/analysis/self-care" element={<SelfCareDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/new-consultation" element={<NewConsultation />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;