import React from 'react';
import { Menu, Bell, User, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  navigateTo: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, navigateTo }) => {

  const [notificationCount, setNotificationCount] = React.useState(3);
  
  return (
    <header className="z-10 py-4 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <div className="px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="p-1 mr-3 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-green-600"
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-gray-500 dark:text-gray-200" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Çiftçi Paneli</h1>
        </div>

        <div className="flex items-center space-x-4">

          
          <button 
            className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Notifications"
            onClick={() => navigateTo('alerts')}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>
          
          <button 
            className="flex items-center p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Profile"
            onClick={() => navigateTo('profile')}
          >
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;