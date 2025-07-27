import {React, useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          email,
          password,
          confirmPassword
        },
        { withCredentials: true }
      );
      console.log(response);
      
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during signup");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-200 p-4">
      <div className="flex w-full max-w-4xl bg-white shadow-[50px] overflow-hidden rounded-lg">

        {/* Left Side (Image) */}
        <div className="w-1/2 bg-cover bg-center relative "
             style={{ backgroundImage: "url('https://media.istockphoto.com/id/1329630754/photo/shot-of-a-young-women-carrying-shopping-bag-standing-isolated-over-orange-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=4pbHRBixJsuqx4NxQRVu6hXf47xnCLVRsiTyydkPu_4=')" }} // Add your image URL
        >
          {/* Optional: Overlay Text */}
        </div>

        {/* Right Side (Signup Form) */}
        <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8 

">
          <h2 className="text-black text-4xl font-bold mb-8">Register Here</h2>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-black text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-black text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
            >
              Register
            </button>
          </form>
          <Link to="/login">
          <button
            className="mt-4 text-black underline hover:text-gray-800 transition duration-300"
          >
            Already have an account? Login
          </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
