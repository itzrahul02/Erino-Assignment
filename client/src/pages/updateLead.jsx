import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UpdateLead = ({ lead, onClose, refresh }) => {
  const [formData, setFormData] = useState({ ...lead });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/v2/leads/updateLead/${lead._id}`,
        formData,
        { withCredentials: true }
      );
      refresh();
      onClose();
      
    } catch (error) {
      console.error("Error updating lead", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Update Lead</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="border p-2 rounded"/>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded"/>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded"/>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded"/>
          <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="border p-2 rounded"/>
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border p-2 rounded"/>
          <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="border p-2 rounded"/>
 
          {/* Enums */}
          <select name="source" value={formData.source} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Source</option>
            <option value="website">Website</option>
            <option value="facebook_ads">Facebook Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="referral">Referral</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>

          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded">
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>

          <input type="number" name="score" value={formData.score} onChange={handleChange} placeholder="Score (0-100)" className="border p-2 rounded"/>
          <input type="number" name="lead_value" value={formData.lead_value} onChange={handleChange} placeholder="Lead Value" className="border p-2 rounded"/>

          <input type="datetime-local" name="last_activity_at" value={formData.last_activity_at ? new Date(formData.last_activity_at).toISOString().slice(0,16) : ""} onChange={handleChange} className="border p-2 rounded"/>

          <label className="flex items-center col-span-2">
            <input type="checkbox" name="is_qualified" checked={formData.is_qualified} onChange={handleChange} className="mr-2"/>
            Is Qualified
          </label>

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-red-700">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateLead;
