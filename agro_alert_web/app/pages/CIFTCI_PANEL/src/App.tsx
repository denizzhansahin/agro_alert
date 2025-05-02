"use client"
import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import { AppRouterProvider } from './routes/AppRouter';
import './App.css';

function App() {
  return (

      <AppRouterProvider />
  );
}

export default App;