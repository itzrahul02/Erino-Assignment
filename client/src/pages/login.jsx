import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const API_BASE_URL = 'https://erino-assignment-gehr.onrender.com';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        // `${API_BASE_URL}/api/v1/user/login`,
        'https://erino-assignment-gehr.onrender.com/api/v1/user/login',
        // 'http://localhost:3000/api/v1/user/login',
        { email, password },
        { withCredentials: true } 
      );
      navigate("/showleads");
    } catch (error) {
        alert("Login Failed")
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-96">
    <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
      Login
    </h2>

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    <button 
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md w-full transition duration-200"
      type="submit"
    >
      Login
    </button>

    <p className="mt-4 text-sm text-gray-500 text-center">
      Don't have an account? 
      <Link to={'/register'} className="text-blue-600 font-medium hover:underline cursor-pointer ml-1">
        Register
      </Link>
    </p>
  </form>
</div>

  );
};

export default Login; 
