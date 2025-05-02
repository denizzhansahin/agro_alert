'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GOZLEM_BY_ID } from '@/app/GraphQl/Gozlem.graphql';
import { ArrowLeft } from 'lucide-react';

interface ObservationDetailProps {
  observationId: number;
  onBack: () => void;
}

const ObservationDetail: React.FC<ObservationDetailProps> = ({ observationId, onBack }) => {
  const { data, loading, error } = useQuery(GET_GOZLEM_BY_ID, {
    variables: { id: observationId },
    fetchPolicy: 'cache-and-network',
  });

  const [observation, setObservation] = useState<any>(null);

  useEffect(() => {
    if (data?.gozlemById) {
      setObservation(data.gozlemById);
    }
  }, [data]);

  if (loading) {
    return <p>Veriler yükleniyor...</p>;
  }

  if (error) {
    return <p>Hata: {error.message}</p>;
  }

  if (!observation) {
    return <p>Gözlem bilgisi bulunamadı.</p>;
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
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Gözlem Detayları</h2>
      </div>

      {/* Observation Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gözlem Tipi</h3>
            <p className="text-gray-600 dark:text-gray-300">{observation.gozlem_tipi}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Değer</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {observation.sayisal_deger || observation.metin_deger || 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Konum</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {observation.gps_enlem}, {observation.gps_boylam}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Oluşturulma Tarihi</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {new Date(observation.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      {observation.resim_base64 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Gözlem Görseli</h3>
          <img
            src={`data:image/jpeg;base64,${observation.resim_base64}`}
            alt="Gözlem Görseli"
            className="rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default ObservationDetail;