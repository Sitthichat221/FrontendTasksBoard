// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // ถ้าไม่มี token จะถูกส่งกลับไปที่หน้า login
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
