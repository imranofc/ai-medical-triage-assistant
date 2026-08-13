import Home from "./pages/Home/Home.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App(){
  return (
    <BrowserRouter>

    <Navbar/>

    <Routes>
      <Route path="/" element={<Home/>} /> 
      <Route path="/login" element={<Login/>}/>
      <Route path="/Register" element={<Register/>}/>
    </Routes>

    <Footer/>

    </BrowserRouter>
  )
};

export default App;