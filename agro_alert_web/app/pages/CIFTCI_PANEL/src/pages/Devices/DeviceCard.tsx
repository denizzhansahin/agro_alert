import React from 'react';
import { Cpu, Clock, MapPin, ExternalLink } from 'lucide-react';

interface DeviceProps {
  id: number;
  name: string;
  serialNo: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  location: string;
  notes: string;
}

interface DeviceCardProps {
  device: DeviceProps;
  onClick: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick }) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Çevrimiçi';
      case 'offline':
        return 'Çevrimdışı';
      case 'warning':
        return 'Uyarı';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-2 mr-3">
              <Cpu className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{device.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">S/N: {device.serialNo}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(device.status)}`}>
            <span className={`w-2 h-2 mr-1.5 rounded-full ${getStatusDot(device.status)}`}></span>
            {getStatusText(device.status)}
          </span>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Son görülme: {device.lastSeen}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{device.location}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{device.notes}</p>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <span className="text-sm font-medium">Detaylar</span>
            <ExternalLink className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;