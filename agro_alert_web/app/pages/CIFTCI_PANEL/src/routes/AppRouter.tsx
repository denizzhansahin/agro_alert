import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Devices from '../pages/Devices/Devices';
import DeviceDetail from '../pages/Devices/DeviceDetail';
import Observations from '../pages/Observations/Observations';
import ObservationDetail from '../pages/Observations/ObservationDetail';
import Alerts from '../pages/Alerts/Alerts';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound';
import Tespit from '../pages/Tespit/Tespit';

export function AppRouterProvider() {
  // Simple router implementation since we don't have react-router
  const [currentPage, setCurrentPage] = React.useState<string>('dashboard');
  const [selectedDeviceId, setSelectedDeviceId] = React.useState<number | null>(null);
  const [selectedObservationId, setSelectedObservationId] = React.useState<number | null>(null);

  const [userId, setUserId] = useState(null);
  
      useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser?.id) {
          setUserId(storedUser.id);
        }
      }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'devices':
        return <Devices onSelectDevice={(id) => {
          setSelectedDeviceId(id);
          setCurrentPage('device-detail');
        }} />;
      case 'device-detail':
        return (
          <DeviceDetail
            deviceId={selectedDeviceId!}
            onBack={() => setCurrentPage('devices')}
            onSelectObservation={(id) => {
              setSelectedObservationId(id);
              setCurrentPage('observation-detail');
            }}
          />
        );
      case 'observations':
        return (
          <Observations
            onSelectObservation={(id) => {
              setSelectedObservationId(id);
              setCurrentPage('observation-detail');
            }}
          />
        );
      case 'observation-detail':
        return (
          <ObservationDetail
            observationId={selectedObservationId!}
            onBack={() => setCurrentPage('observations')}
          />
        );
      case 'alerts':
        return <Alerts />;
      case 'profile':
        return <Profile />;
      case 'tespit':
        return <Tespit />;
      default:
        return <NotFound />;
    }
  };

  return (
    <Layout 
      navigateTo={(page) => setCurrentPage(page)}
      currentPage={currentPage}
    >
      {renderPage()}
    </Layout>
  );
}