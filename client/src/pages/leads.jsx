import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const CreateLead = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    is_qualified: false,
  });

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
      const res = await axios.post(
        `${API_BASE_URL}/api/v2/leads`,
        formData,
        { withCredentials: true }
      );
      alert("Lead created!");
      console.log(res.data);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        state: "",
        source: "website",
        status: "new",
        score: 0,
        lead_value: 0,
        is_qualified: false,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create lead");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6">Create Lead</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mt-4"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mt-4"
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="border p-2 rounded w-full mt-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="website">Website</option>
            <option value="facebook_ads">Facebook Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="referral">Referral</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="number"
            name="score"
            placeholder="Score (0-100)"
            value={formData.score}
            onChange={handleChange}
            min={0}
            max={100}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="lead_value"
            placeholder="Lead Value"
            value={formData.lead_value}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            name="is_qualified"
            checked={formData.is_qualified}
            onChange={handleChange}
            className="mr-2"
          />
          Qualified
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full mt-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Create Lead
        </button>
      </form>
    </div>
  );
};

export default CreateLead;
