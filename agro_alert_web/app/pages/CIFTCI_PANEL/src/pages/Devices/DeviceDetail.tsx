import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CIHAZ_BY_ID } from '@/app/GraphQl/Cihazlar.graphql';
import { GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID } from '@/app/GraphQl/Gozlem.graphql';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Cpu,
  Edit,
  BarChart2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface DeviceDetailProps {
  deviceId: number;
  onBack: () => void;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({ deviceId, onBack }) => {
  const { data: deviceData, loading: deviceLoading, error: deviceError } = useQuery(GET_CIHAZ_BY_ID, {
    variables: { id: deviceId },
    fetchPolicy: 'cache-and-network',
  });

  const { data: observationsData, loading: observationsLoading, error: observationsError } = useQuery(
    GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID,
    {
      variables: { cihazKullaniciId: deviceId },
      skip: !deviceId,
      fetchPolicy: 'cache-and-network',
    }
  );

  const [device, setDevice] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);

  useEffect(() => {
    if (deviceData?.getCihazById) {
      setDevice(deviceData.getCihazById);
    }
  }, [deviceData]);

  useEffect(() => {
    if (observationsData?.gozlemlerByCihazKullaniciId) {
      setObservations(observationsData.gozlemlerByCihazKullaniciId);
    }
  }, [observationsData]);

  if (deviceLoading || observationsLoading) {
    return <p>Veriler yükleniyor...</p>;
  }

  if (deviceError || observationsError) {
    return <p>Hata: {deviceError?.message || observationsError?.message}</p>;
  }

  if (!device) {
    return <p>Cihaz bilgisi bulunamadı.</p>;
  }

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
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{device.isim}</h3>
              <p className="text-gray-500 dark:text-gray-400">S/N: {device.cihaz_seri_no}</p>

              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
                {device.durum}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:flex-grow">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Son Görülme</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {device.son_gorulme
                    ? new Date(device.son_gorulme).toLocaleString()
                    : 'Bilinmiyor'}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Konum</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {device.konum_enlem}, {device.konum_boylam}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kurulum Tarihi</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {new Date(device.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Observations Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Son Gözlemler</h3>
          </div>
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
              {observations.map((observation) => (
                <tr key={observation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {observation.gozlem_tipi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {observation.sayisal_deger || observation.metin_deger || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(observation.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
