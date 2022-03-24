import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from './socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ isFetching: true });

  const login = async (credentials) => {
    try {
      const { data } = await axios.post('/auth/login', credentials);
      await localStorage.setItem('messenger-token', data.token);
      setUser(data);
      socket.emit('go-online', data.id);
    } catch (error) {
      console.error(error);
      setUser({ error: error.response.data.error || 'Server Error' });
    }
  };

  const register = async (credentials) => {
    try {
      const { data } = await axios.post('/auth/register', credentials);
      await localStorage.setItem('messenger-token', data.token);
      setUser(data);
      socket.emit('go-online', data.id);
    } catch (error) {
      console.error(error);
      setUser({ error: error.response.data.error || 'Server Error' });
    }
  };

  const logout = async (id) => {
    try {
      await axios.delete('/auth/logout');
      await localStorage.removeItem('messenger-token');
      setUser({});
      socket.emit('logout', id);
    } catch (error) {
      console.error(error);
    }
  };

  // Lifecycle

  useEffect(() => {
    const fetchUser = async () => {
      setUser((prev) => ({ ...prev, isFetching: true }));
      try {
        const { data } = await axios.get('/auth/user');
        setUser(data);
        if (data.id) {
          socket.emit('go-online', data.id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUser((prev) => ({ ...prev, isFetching: false }));
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
