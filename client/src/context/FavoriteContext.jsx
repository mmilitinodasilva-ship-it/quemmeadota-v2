import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSocket } from './SocketContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const socket = useSocket();
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pet_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pet_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const checkFavoritePetsStatus = async () => {
      if (favorites.length === 0) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
        const response = await fetch(`${apiUrl}/api/pets?status=available`);
        const availablePets = await response.json();
        const availableIds = availablePets.map(pet => pet._id);
        
        setFavorites(prev => {
          const filtered = prev.filter(id => availableIds.includes(id));
          if (filtered.length !== prev.length) {
            // Some pets were adopted while user was away
            return filtered;
          }
          return prev;
        });
      } catch (error) {
        console.error('Error checking favorite pets status:', error);
      }
    };
    
    checkFavoritePetsStatus();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('pet_adopted', (data) => {
        const { petId } = data;
        setFavorites((prev) => {
          if (prev.includes(petId)) {
            alert('Desculpe, mas esse animalzinho já encontrou um lar!');
            return prev.filter((id) => id !== petId);
          }
          return prev;
        });
      });

      socket.on('pet_removed', (data) => {
        const { petId } = data;
        setFavorites((prev) => prev.filter((id) => id !== petId));
      });

      return () => {
        socket.off('pet_adopted');
        socket.off('pet_removed');
      };
    }
  }, [socket]);

  const toggleFavorite = (petId) => {
    setFavorites((prev) => {
      if (prev.includes(petId)) {
        return prev.filter((id) => id !== petId);
      } else {
        return [...prev, petId];
      }
    });
  };

  const isFavorite = (petId) => favorites.includes(petId);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
