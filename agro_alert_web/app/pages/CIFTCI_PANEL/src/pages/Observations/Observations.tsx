import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Filter, ArrowDown, ArrowUp, Download, Eye } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID } from '@/app/GraphQl/Gozlem.graphql';
import { GET_CIHAZ_KULLANICI_BY_KULLANICI_ID } from '@/app/GraphQl/CihazKullanici.graphql';

interface ObservationsProps {
  onSelectObservation: (id: number) => void;
}

const Observations: React.FC<ObservationsProps> = ({ onSelectObservation }) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState('all');
  const [cihazKullaniciId, setCihazKullaniciId] = useState<number | null>(null);

   const [kullaniciId, setKullaniciId] = useState<number | null>(null);
   
     useEffect(() => {
       const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
       if (storedUser?.id) {
         setKullaniciId(storedUser.id);
         setCihazKullaniciId(storedUser.cihazKullaniciId || null);
       }
     }, []);
   
     const { data: cihazData} = useQuery(GET_CIHAZ_KULLANICI_BY_KULLANICI_ID, {
       variables: { kullaniciId },
       skip: !kullaniciId,
       fetchPolicy: 'cache-and-network',
       onCompleted: (data) => {
         if (data?.cihazKullaniciByKullaniciId?.id) {
           setCihazKullaniciId(data.cihazKullaniciByKullaniciId.id);
         }
       },
     });
   
     console.log('Cihaz Data:', cihazData?.cihazKullaniciByKullaniciId.id);
     console.log('Cihaz Kullanici ID:', cihazKullaniciId);
   
   
     const { data: gozlemData, loading, error } = useQuery(GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID, {
       variables: { cihazKullaniciId },
       skip: !cihazKullaniciId,
       fetchPolicy: 'cache-and-network',
     });

  console.log('Cihaz Kullanıcı ID:', cihazKullaniciId);
  console.log('Gozlemler:',gozlemData)

  const observations = useMemo(() => {
    if (!gozlemData?.gozlemlerByCihazKullaniciId) return [];
    return gozlemData.gozlemlerByCihazKullaniciId.map((gozlem: any) => ({
      id: gozlem.id,
      deviceName: 'Cihaz', // Replace with actual device name if available
      type: gozlem.gozlem_tipi,
      value: gozlem.sayisal_deger || gozlem.metin_deger || 'N/A',
      timestamp: new Date(gozlem.created_at).toLocaleString(),
      hasImage: !!gozlem.resim_base64,
    }));
  }, [gozlemData]);

  const filteredObservations = observations.filter((obs) => {
    if (filterType === 'all') return true;
    return obs.type === filterType;
  });

  const observationTypes = useMemo(() => ['all', ...Array.from(new Set<string>(observations.map((obs) => obs.type)))], [observations]);

  const sortedObservations = [...filteredObservations].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  if (loading) {
    return <p>Veriler yükleniyor...</p>;
  }

  if (error) {
    return <p>Hata: {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Gözlemler</h2>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {observationTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tüm Gözlem Türleri' : type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <Filter className="h-4 w-4" />
            </div>
          </div>

          <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition">
            <Calendar className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
            Tarih Filtrele
          </button>
        </div>

        <div className="flex gap-4">
          <button
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
            ) : (
              <ArrowDown className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
            )}
            {sortDirection === 'asc' ? 'Eskiden Yeniye' : 'Yeniden Eskiye'}
          </button>

          <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition">
            <Download className="h-5 w-5 mr-2" />
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Observations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cihaz
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tür
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Değer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tarih/Saat
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedObservations.map((observation) => (
                <tr
                  key={observation.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => onSelectObservation(observation.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {observation.deviceName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {observation.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {observation.value}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {observation.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      {observation.hasImage && (
                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                          <Eye className="h-5 w-5" />
                        </button>
                      )}
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        Detaylar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedObservations.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p>Gözlem bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Observations;