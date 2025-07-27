import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const useUserData = (csvPath) => {
  const [users, setUsers] = useState([]);

  const loadUserData = async () => {
    try {
      const response = await fetch(csvPath);
      const data = await response.text();
      const parsedData = Papa.parse(data, { header: true }).data; // Parse CSV data
      setUsers(parsedData);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [csvPath]);

  return users;
};

export default useUserData;