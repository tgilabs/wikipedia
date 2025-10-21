import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

// Default implementation, that you can customize
export default function Root({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
