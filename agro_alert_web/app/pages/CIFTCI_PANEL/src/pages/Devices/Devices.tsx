"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, MapPin, Filter } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_CIHAZ_KULLANICI_BY_KULLANICI_ID } from '@/app/GraphQl/CihazKullanici.graphql';
import DeviceCard from './DeviceCard';

interface DevicesProps {
  onSelectDevice: (id: number) => void;
}

const Devices: React.FC<DevicesProps> = ({ onSelectDevice }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [kullaniciId, setKullaniciId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.id) {
      setKullaniciId(storedUser.id);
    }
    console.log('User ID:', storedUser?.id);
  }, []);

  console.log('kullaniciId', kullaniciId);
  const { data, loading, error } = useQuery(GET_CIHAZ_KULLANICI_BY_KULLANICI_ID, {
    variables: { kullaniciId: kullaniciId }, // Ensure it's an integer
    skip: !kullaniciId,
    fetchPolicy: 'cache-and-network',
  });

  console.log('kullaniciId', kullaniciId);
  console.log('Devices data:', data);
  console.log('Devices loading:', loading);
  console.log('Devices error:', error);
  const devices = React.useMemo(() => {
    if (!data?.cihazKullaniciByKullaniciId) return [];
    const record = data.cihazKullaniciByKullaniciId;
    return (record?.cihazlar ?? []).map((cihaz: any) => ({
      id: cihaz.id,
      kullanici_isim: `${record.kullanici.isim} ${record.kullanici.soyisim}`,
      kullanici_eposta: record.kullanici.eposta,
      cihazlar: cihaz.isim,
      created_at: new Date(record.created_at).toLocaleString(),
      updated_at: new Date(record.updated_at).toLocaleString(),
    }));
  }, [data]);

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name ||
      device.serialNo;

    const matchesFilter = filterStatus === 'all' || device.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <p>Veriler yükleniyor...</p>;
  }

  if (error) {
    return <p>Hata: {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Cihazlar</h2>

        <button className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 text-white rounded-lg transition">
          <Plus className="w-5 h-5 mr-2" />
          Yeni Cihaz Ekle
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Cihaz ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <div className="relative">
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="online">Çevrimiçi</option>
              <option value="offline">Çevrimdışı</option>
              <option value="warning">Uyarı</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <Filter className="h-4 w-4" />
            </div>
          </div>

          <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition">
            <MapPin className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
            Harita
          </button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} onClick={() => onSelectDevice(device.id)} />
        ))}

        {devices.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
            <p>Cihaz bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devices;