import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import UpdateLead from "./updateLead";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = 'https://erino-assignment-gehr.onrender.com';

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const limit = 10;

  const fetchLeads = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        // `http://localhost:3000/api/v2/leads`,
        `${API_BASE_URL}/api/v2/leads`,
        {
          params: { page: pageNum, limit },
          withCredentials: true,
        }
      );
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
      await axios.delete(
        `${API_BASE_URL}/api/v2/leads/deletedLead/${id}`,
        { withCredentials: true }
      );
      alert("Lead deleted!");
      fetchLeads(page);
    } catch (err) {
      console.error(err);
      alert("Failed to delete lead");
    }
  };

  const handleSingleLead = (id) => {
    navigate(`/singlelead/${id}`);
  };

  const filteredLeads = leads.filter((lead) =>
    `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.toLowerCase()) ||
    (lead.phone && lead.phone.toLowerCase().includes(search.toLowerCase())) ||
    (lead.company && lead.company.toLowerCase().includes(search.toLowerCase())) ||
    (lead.status && lead.status.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Leads List</h2>

      {/* 🔍 Search Box */}
      <input
        type="text"
        placeholder="Search by name, email, phone, company or status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

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
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{lead.first_name} {lead.last_name}</td>
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
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleSingleLead(lead._id)}
                        className="text-2xl"
                      >
                        ➡️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center p-4">
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
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
        <UpdateLead
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          refresh={fetchLeads}
        />
      )}
    </div>
  );
};

export default LeadsList;
