import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const socket = io(import.meta.env.VITE_API_URL || window.location.origin);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    // Opcional: Lógica para lidar com eventos globais de socket, se necessário
    socket.on('connect', () => {
      console.log('Socket conectado com ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket desconectado.');
    });

    // Limpeza ao desmontar o provider
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
