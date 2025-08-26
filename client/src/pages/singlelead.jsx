
import React, { useEffect, useState } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = 'https://erino-assignment-gehr.onrender.com';


const SingleLead = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v2/leads/singlelead/${id}`
          // `http://localhost:3000/api/v2/leads/singlelead/${id}`
          , {
          withCredentials: 'include',
        });
        setLead(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching lead:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading lead details...</p>;
  if (!lead) return <p className="text-center mt-10 text-red-500">Lead not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-6">Lead Details</h1>

      <div className="grid grid-cols-2 gap-4">
        <p><strong>First Name:</strong> {lead.first_name}</p>
        <p><strong>Last Name:</strong> {lead.last_name}</p>
        <p><strong>Email:</strong> {lead.email}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Company:</strong> {lead.company}</p>
        <p><strong>City:</strong> {lead.city}</p>
        <p><strong>State:</strong> {lead.state}</p>
        <p><strong>Source:</strong> {lead.source}</p>
        <p><strong>Status:</strong> {lead.status}</p>
        <p><strong>Score:</strong> {lead.score}</p>
        <p><strong>Lead Value:</strong> ₹{lead.lead_value}</p>
        <p><strong>Last Activity At:</strong> {lead.last_activity_at ? new Date(lead.last_activity_at).toLocaleString() : "N/A"}</p>
        <p><strong>Qualified:</strong> {lead.is_qualified ? "Yes ✅" : "No ❌"}</p>
      </div>

      <div className="mt-6 flex justify-between">

        <button
          onClick={() => navigate("/showleads")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back to Leads
        </button>
      </div>
    </div>
  );
};

export default SingleLead;
