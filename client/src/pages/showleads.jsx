import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import UpdateLead from "./updateLead";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);

  const navigate=useNavigate()

  const limit = 10;

  const fetchLeads = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v2/leads`, {
        params: { page: pageNum, limit },
        withCredentials: true,
      });
      setLeads(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(page);
  }, []);

  const handleNext = () => {
    if (page < totalPages) {
      fetchLeads(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      fetchLeads(page - 1);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/v2/leads/deleteLead/${id}`, {
        withCredentials: true,
      });
      alert("Lead deleted!");
      fetchLeads(page);
    } catch (err) {
      console.error(err);
      alert("Failed to delete lead");
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead._id);
    setFormData(lead);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/v2/leads/updateLead/${editingLead}`,
        formData,
        { withCredentials: true }
      );
      alert("Lead updated!");
      setEditingLead(null);
      fetchLeads(page);
    } catch (err) {
      console.error(err);
      alert("Failed to update lead");
    }
  };

  const handleSingleLead = async(id)=>{
    console.log("clicked here to navigate");
    navigate(`/${id}`)
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Leads List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Company</th>
                <th className="p-2">City</th>
                <th className="p-2">State</th>
                <th className="p-2">Source</th>
                <th className="p-2">Status</th>
                <th className="p-2">Score</th>
                <th className="p-2">Lead Value</th>
                <th className="p-2">Qualified</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {lead.first_name} {lead.last_name}
                  </td>
                  <td className="p-2">{lead.email}</td>
                  <td className="p-2">{lead.phone}</td>
                  <td className="p-2">{lead.company}</td>
                  <td className="p-2">{lead.city}</td>
                  <td className="p-2">{lead.state}</td>
                  <td className="p-2">{lead.source}</td>
                  <td className="p-2">{lead.status}</td>
                  <td className="p-2">{lead.score}</td>
                  <td className="p-2">{lead.lead_value}</td>
                  <td className="p-2">{lead.is_qualified ? "Yes" : "No"}</td>
                  <td className="p-2 space-x-2 flex items-center">
                    <button
                      onClick={() =>setSelectedLead(lead)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button 
                     onClick={()=>handleSingleLead(lead._id)}
                     className="text-2xl"
                    >
                        ➡️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded ${
            page === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Update Modal */}

            {selectedLead && (
        <UpdateLead lead={selectedLead} onClose={() => setSelectedLead(null)} refresh={fetchLeads} />
      )}
    </div>
  );
};

export default LeadsList;
