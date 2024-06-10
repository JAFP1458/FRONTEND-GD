import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Landing from './views/examples/Landing';
import Login from './views/examples/Login';
import Profile from './views/examples/Profile';
import Register from './views/examples/Register';
import UserRolesComponent from './components/UserRolesComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';

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
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register-page" element={<Register />} />
      <Route
        path="/landing-page"
        element={
          <ProtectedRoute token={token} roles={['Operador', 'Gestor']}>
            <Landing token={token} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-page"
        element={
          <ProtectedRoute token={token} roles={['Operador', 'Gestor']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-roles"
        element={
          <ProtectedRoute token={token} roles={['Gestor']}>
            <UserRolesComponent token={token} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route
        path="/role-based-redirect"
        element={<RoleBasedRedirect token={token} />}
      />
    </Routes>
  );
};

export default App;
