import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  trend, 
  trendUp, 
  icon,
  color
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-900';
      case 'green':
        return 'bg-green-50 dark:bg-green-900';
      case 'orange':
        return 'bg-orange-50 dark:bg-orange-900';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-900';
      default:
        return 'bg-gray-50 dark:bg-gray-900';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 transition-colors duration-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${getColorClasses(color)}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </dt>
            <dd>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {value}
              </div>
            </dd>
          </dl>
        </div>
      </div>
      <div className="mt-4">
        <div className={`flex items-center text-sm ${
          trendUp 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          
          <span className="ml-1">
             (son 30 gün)
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;