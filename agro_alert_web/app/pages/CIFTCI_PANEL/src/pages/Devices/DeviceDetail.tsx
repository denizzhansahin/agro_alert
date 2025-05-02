import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Cpu, 
  Edit, 
  BarChart2, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface DeviceDetailProps {
  deviceId: number;
  onBack: () => void;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({ deviceId, onBack }) => {
  // Mock device data based on deviceId
  const device = {
    id: deviceId,
    name: 'Tarla Sensörü 1', 
    serialNo: 'SNS-001',
    status: 'online', 
    lastSeen: '2 dakika önce',
    location: 'Tarla 1 - Kuzey',
    notes: 'Toprak nemi ve sıcaklık takibi için kuruldu. Periyodik bakım gerekiyor.',
    installDate: '15.03.2024',
    batteryLevel: 78,
    signalStrength: 85,
    firmwareVersion: '2.1.0',
    coordinates: {
      latitude: 39.5812,
      longitude: 32.1264
    }
  };
  
  // Mock observations
  const recentObservations = [
    { id: 1, type: 'Toprak Nemi', value: '42%', time: '10 dakika önce' },
    { id: 2, type: 'Toprak Sıcaklığı', value: '18°C', time: '10 dakika önce' },
    { id: 3, type: 'Hava Sıcaklığı', value: '24°C', time: '10 dakika önce' },
    { id: 4, type: 'Nem Oranı', value: '65%', time: '10 dakika önce' }
  ];
  
  // Mock alerts
  const recentAlerts = [
    { id: 1, level: 'warning', message: 'Toprak nem seviyesi düşük', time: '3 saat önce' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button 
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Cihaz Detayları</h2>
        <button className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <Edit className="h-5 w-5" />
        </button>
      </div>
      
      {/* Device Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-start">
          {/* Device Icon and Basic Info */}
          <div className="flex items-start mb-4 md:mb-0 md:mr-8">
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-3 mr-4">
              <Cpu className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{device.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">S/N: {device.serialNo}</p>
              
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
                Çevrimiçi
              </div>
            </div>
          </div>
          
          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:flex-grow">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Son Görülme</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{device.lastSeen}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Konum</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">{device.location}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kurulum Tarihi</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">{device.installDate}</p>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Notlar</h4>
          <p className="text-gray-600 dark:text-gray-300">{device.notes}</p>
        </div>
      </div>
      
      {/* Status Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 transition-colors duration-200">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Batarya Seviyesi</h4>
          <div className="flex items-center mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${device.batteryLevel}%` }}
              ></div>
            </div>
            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-white">{device.batteryLevel}%</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 transition-colors duration-200">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sinyal Gücü</h4>
          <div className="flex items-center mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${device.signalStrength}%` }}
              ></div>
            </div>
            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-white">{device.signalStrength}%</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 transition-colors duration-200">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Yazılım Versiyonu</h4>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{device.firmwareVersion}</p>
          <div className="mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Güncel (Son güncelleme: 10.05.2024)</span>
          </div>
        </div>
      </div>
      
      {/* Recent Observations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Son Gözlemler</h3>
          </div>
          <button className="text-sm text-green-600 hover:text-green-700 dark:text-green-500 hover:underline flex items-center">
            Tümünü Gör
            <ExternalLink className="ml-1 h-4 w-4" />
          </button>
        </div>
        
        <div className="p-0">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tür
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Değer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Zaman
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentObservations.map(observation => (
                <tr key={observation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {observation.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {observation.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {observation.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aktif Uyarılar</h3>
          </div>
          
          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="border-l-4 border-l-orange-600 pl-3 py-2">
                <div className="flex items-start">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceDetail;