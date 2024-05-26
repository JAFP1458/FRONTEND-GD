import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Index from './views/Index';
import Landing from './views/examples/Landing';
import Login from './views/examples/Login';
import Profile from './views/examples/Profile';
import Register from './views/examples/Register';
import ProtectedRoute from './components/ProtectedRoute'; // Asegúrate de importar el componente ProtectedRoute

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  };
};

const App = () => {
  const { token, setToken } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register-page" element={<Register />} />
      <Route path="/" element={<Navigate to="/landing-page" replace />} />
      <Route
        path="/landing-page"
        element={
          <ProtectedRoute token={token}>
            <Landing token={token} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-page"
        element={
          <ProtectedRoute token={token}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
