import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
  id: number;
  level: 'critical' | 'warning' | 'info';
  message: string;
  deviceName: string;
  time: string;
}

interface AlertPreviewProps {
  alert: AlertProps;
}

const AlertPreview: React.FC<AlertPreviewProps> = ({ alert }) => {
  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertClass = (level: string) => {
    switch (level) {
      case 'critical':
        return 'border-l-red-600';
      case 'warning':
        return 'border-l-orange-600';
      case 'info':
        return 'border-l-blue-600';
      default:
        return 'border-l-gray-600';
    }
  };

  return (
    <div className={`border-l-4 pl-3 py-2 ${getAlertClass(alert.level)}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {getAlertIcon(alert.level)}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
          <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span>{alert.deviceName}</span>
            <span className="mx-1">•</span>
            <span>{alert.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPreview;