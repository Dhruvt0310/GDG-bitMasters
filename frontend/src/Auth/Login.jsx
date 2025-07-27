import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      }, { withCredentials: true });

      if (response.status === 200) {
        onLogin();
        navigate("/");
        setError("");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="flex w-full max-w-4xl bg-white shadow-[50px] overflow-hidden rounded-lg">
        <div className="w-1/2 bg-cover bg-center relative"
             style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1701180534408-c662cefefa15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwd2l0aCUyMHNob3BwaW5nJTIwYmFnc3xlbnwwfHwwfHx8MA%3D%3D')" }}>
        </div>
        <div className="w-1/2 bg-orange-400 flex flex-col items-center justify-center p-8">
          <h2 className="text-black text-4xl font-bold mb-8">Sign In Here</h2>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-black text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-[#323232] transition duration-300"
            >
              Log In
            </button>
          </form>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;