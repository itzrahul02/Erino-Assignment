import { useState } from "react";
import axios from "axios";
import React from "react";
import { Navigate,Link } from "react-router-dom";
const API_BASE_URL = 'https://erino-assignment-gehr.onrender.com';


export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    username: "",
    password: "",
    avatar: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("email", formData.email);
    data.append("fullname", formData.fullname);
    data.append("username", formData.username);
    data.append("password", formData.password);
    if (formData.avatar) data.append("avatar", formData.avatar);

    try {
      const res = await axios.post(
        // `${API_BASE_URL}/api/v1/user/register`,
        'https://erino-assignment-gehr.onrender.com/api/v1/user/register',
        // 'http://localhost:3000/api/v1/user/register',
        data,
        {
          withCredentials: true, // send cookies if needed
        }
      );
      console.log(res.data);
      alert("Registration successful!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Registration failed!");
    }
  };

  return (
    <form 
  onSubmit={handleSubmit} 
  className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200"
>
  <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
    Create Your Account
  </h2>

  <input
    type="email"
    name="email"
    placeholder="Email"
    onChange={handleChange}
    required
    className="border border-gray-300 rounded-md p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
  <input
    type="text"
    name="fullname"
    placeholder="Full Name"
    onChange={handleChange}
    required
    className="border border-gray-300 rounded-md p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
  <input
    type="text"
    name="username"
    placeholder="Username"
    onChange={handleChange}
    required
    className="border border-gray-300 rounded-md p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
  <input
    type="password"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    required
    className="border border-gray-300 rounded-md p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
  <input
    type="file"
    name="avatar"
    accept="image/*"
    onChange={handleChange}
    className="mb-4 w-full"
  />
  
  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md w-full transition duration-200"
  >
    Register
  </button>

  <p className="mt-4 text-sm text-gray-500 text-center">
    Already have an account? 
    <Link to={'/'} className="text-blue-600 font-medium hover:underline cursor-pointer ml-1">
      Login
    </Link>
  </p>
</form>

  );
}
