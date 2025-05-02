import React from 'react';
import { ExternalLink } from 'lucide-react';

interface DeviceProps {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  serialNo: string;
}

interface DeviceStatusCardProps {
  device: DeviceProps;
}

const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({ device }) => {
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">{device.name}</h4>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(device.status)}`}>
            <span className={`w-2 h-2 mr-1.5 rounded-full ${getStatusDot(device.status)}`}></span>
            {getStatusText(device.status)}
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <p>S/N: {device.serialNo}</p>
        <p>Son Görülme: {device.lastSeen}</p>
      </div>
      <div className="mt-3 flex justify-end">
        <button className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 text-sm font-medium flex items-center transition-colors">
          Detaylar
          <ExternalLink className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DeviceStatusCard;