import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await axios.get(`${apiUrl}/api/pets`);
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <PetContext.Provider value={{ pets, setPets, loading, fetchPets }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => useContext(PetContext);
