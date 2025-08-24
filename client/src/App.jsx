import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Leads from "./pages/leads.jsx";
import LeadsList from "./pages/showleads.jsx";
import Navbar from "./components/nav.jsx";
import SingleLead from "./pages/singlelead.jsx";
import UpdateLead from "./pages/updateLead.jsx";


function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/showleads" element={<LeadsList/>}/>
        <Route path="/:id" element={<SingleLead/>}/>
        <Route path="updatelead/:id" element={<UpdateLead/>}/>
      </Routes>
    </Router>
  );
}

export default App;
