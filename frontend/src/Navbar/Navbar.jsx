// import React, { useContext, useState, useEffect } from "react";
// import "./Navbar.css";
// import logo from "../assets/logo.png";
// import LoginModal from "../Auth/LoginModal/LoginModal";
// import { UserContext } from "../../context/UserContext";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const { user, logout } = useContext(UserContext); // Access user data
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     const confirmed = window.confirm("Are you sure you want to log out?");
//     if (confirmed) {
//       console.log("Before log-out.");
//       logout(); // Log out the user
//       console.log("After log-out.");
//       navigate("/"); // Redirect to landing page
//     }
//   };

//   const renderProfile = () => {
//     if (user && user.profileImage) {
//       return (
//         <img
//           src={user.profileImage}
//           alt="Profile"
//           className="navbar-profile-image"
//         />
//       );
//     } else if (user && user.name != "John Doe") {
//       return (
//         <span className="profile-initial">{user.name[0].toUpperCase()}</span>
//       );
//     }
//     return (
//       <div className="login-link">
//         <a onClick={openModal}>
//           Log-In/Sign-Up
//         </a>
//       </div>
//     ); // Return null if no user
//   };

//   const toggleDropdown = () => setIsDropdownOpen((prev) => !prev); // Toggle dropdown

//   useEffect(() => {
//     if (!user) {
//       setIsDropdownOpen(false); // Close dropdown if no user is logged in
//     }
//   }, [user]); // Re-run the effect when the user state changes

//   return (
//     <>
//       <nav className="navbar">
//         <ul className="nav-links">
//           <li>
//             <a className="logo" href="/">
//               <img src={logo} alt="logo" />
//             </a>
//           </li>
//           <div className="nav-elements">
//             <li>
//               <a className="nav-link" href="/connect">
//                 Connect
//               </a>
//             </li>
//             <li>
//               <a className="nav-link" href="/about">
//                 Events
//               </a>
//             </li>
//             <li>
//               <a className="nav-link" href="/about">
//                 About
//               </a>
//             </li>
//             <li>
//               <a className="nav-link" href="/contact">
//                 Give Back
//               </a>
//             </li>
//             {user ? (
//               <li className="navbar-profile-section">
//                 <div className="user-profile" onClick={toggleDropdown}>
//                   {renderProfile()}
//                 </div>
//                 {isDropdownOpen && (
//                   <div className="dropdown-menu">
//                     <ul>
//                       <li onClick={() => navigate("/dashboard")}>Dashboard</li>
//                       <li onClick={handleLogout}>Logout</li>
//                     </ul>
//                   </div>
//                 )}
//               </li>
//             ) : (
//               <li>
//                 <a className="login-link" onClick={openModal}>
//                   Log-In/Sign-Up
//                 </a>
//               </li>
//             )}
//           </div>
//         </ul>
//       </nav>
//       {isModalOpen && <LoginModal onClose={closeModal} />}
//     </>
//   );
// };

// export default Navbar;
import React from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";
// import LoginModal from "../Auth/LoginModal/LoginModal";
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <>
      <nav className="navbar ">
        <ul className="nav-links">
          <li>
            <Link to="/" className="logo">
              <img src={logo} alt="logo" />
            </Link>
          </li>
          <div className="nav-elements">
            <li>
            <Link to="/cognition" className="nav-link">
                Cognition
              </Link>
            </li>
            <li>
            <Link to="/SocialNetwork" className="nav-link">
                Social Network
              </Link>
            </li>
            <li>
            <Link to="/counselor" className="nav-link">
                Counselor
              </Link>
            </li>
            <li>
              <Link to="/calendar" className="nav-link">
                Calendar
              </Link>
            </li>
            <li>
              <Link to="/trend" className="nav-link">
                Trend Analysis
              </Link>
            </li>
          </div>
        </ul>
      </nav>
      {/* <LoginModal /> */}
    </>
  );
};

export default Navbar;