import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";

import HomePage from "./pages/HomePage";
import URL from "./pages/URL";
import WiFi from "./pages/WiFi";
import Read_QR_Code from "./pages/Read_QR_Code";
import Get_QR_Code from "./pages/Get_QR_Code";

function App() {
    return (
        <div className="App">
            <Router>
                <Navigation></Navigation>
                <Routes>
                    <Route path="/" element={<HomePage />} exact></Route>
                    <Route path="/URL" element={<URL />}></Route>
                    <Route path="/get-QR-Code/:img" element={<Get_QR_Code />} />
                    <Route path="/WiFi" element={<WiFi />}></Route>
                    <Route path="/Read_QR_Code" element={<Read_QR_Code />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
