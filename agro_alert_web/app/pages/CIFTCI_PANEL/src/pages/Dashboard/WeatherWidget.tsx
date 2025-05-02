import React from 'react';
import { Cloud, CloudRain, Sun, Thermometer } from 'lucide-react';

const WeatherWidget = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-sm p-4 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">Hava Durumu</h3>
          <p className="text-blue-100 text-sm">Ankara, Polatlı</p>
        </div>
        <Sun className="h-10 w-10 text-yellow-300" />
      </div>
      
      <div className="mt-4">
        <div className="flex items-center">
          <Thermometer className="h-5 w-5 mr-2" />
          <span className="text-3xl font-bold">24°C</span>
        </div>
        <p className="text-blue-100 mt-1">Parçalı Bulutlu</p>
      </div>
      
      <div className="mt-4 border-t border-blue-400 pt-3">
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <span className="text-sm">Paz</span>
            <Sun className="h-5 w-5 my-1" />
            <span className="text-sm">26°</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm">Pzt</span>
            <Cloud className="h-5 w-5 my-1" />
            <span className="text-sm">23°</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm">Sal</span>
            <CloudRain className="h-5 w-5 my-1" />
            <span className="text-sm">20°</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm">Çar</span>
            <Cloud className="h-5 w-5 my-1" />
            <span className="text-sm">22°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;