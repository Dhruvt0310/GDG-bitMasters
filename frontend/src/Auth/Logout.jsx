import React from "react";
import axios from 'axios';

const Logout = ({onLogout}) => {
    const handleLogout = async () => {
        try{
            const response = await axios.get('http://localhost:3000/api/auth/logout' , {withCredentials : true});   
            alert(response.data.message);
            onLogout();
        }
        catch(err){
            console.error("Error in logout : ", err);
        }
    }

    return (
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-50" onClick={handleLogout}>Logout</button>
    )
}; 

export default Logout;