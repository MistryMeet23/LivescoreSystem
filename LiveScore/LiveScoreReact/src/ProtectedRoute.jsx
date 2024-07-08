// import React from 'react';
import {  Navigate } from 'react-router-dom';

const ProtectedRoute = (Component, role) => {
  
    return (props) => {
        const isAuthenticated = () => {
            // Check if the user is authenticated (e.g., by checking the presence of a valid token)
            const token = localStorage.getItem('token');
            return token !== null && token !== undefined;
          };

        const userRole = localStorage.getItem('role');
    
        return isAuthenticated && userRole === role ? (
          <Component {...props} />
        ) : (
          <Navigate to="/" />
        );
      };
  
}

export default ProtectedRoute
