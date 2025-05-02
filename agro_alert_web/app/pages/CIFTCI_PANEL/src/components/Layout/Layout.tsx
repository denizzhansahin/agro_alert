import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileSidebar from './MobileSidebar';

interface LayoutProps {
  children: React.ReactNode;
  navigateTo: (page: string) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, navigateTo, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar navigateTo={navigateTo} currentPage={currentPage} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        navigateTo={(page) => {
          navigateTo(page);
          setSidebarOpen(false);
        }}
        currentPage={currentPage}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          navigateTo={navigateTo}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;