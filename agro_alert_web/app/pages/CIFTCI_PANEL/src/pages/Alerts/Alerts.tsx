import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Search, Bell, AlertCircle, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_UYARILAR_BY_KULLANICI_ID } from '@/app/GraphQl/Uyari.graphql';

const Alerts = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [kullaniciId, setKullaniciId] = useState<number | null>(null);
  const [cihazKullaniciId, setCihazKullaniciId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.id) {
      setKullaniciId(storedUser.id);
      setCihazKullaniciId(storedUser.cihazKullaniciId || null);
    }
  }, []);



  const { data, loading, error } = useQuery(GET_UYARILAR_BY_KULLANICI_ID, {
    variables: { kullaniciId },
    skip: !kullaniciId,
    fetchPolicy: 'cache-and-network',
  });
  console.log('Kullanici ID:', kullaniciId);
  console.log('Uyari Data:', data);

  const alerts = useMemo(() => {
    if (!data?.uyarilarByKullaniciId) return [];
    return data.uyarilarByKullaniciId.map((uyari: any) => ({
      id: uyari.id,
      deviceName: uyari.tespit?.gozlem?.cihaz_kullanici?.cihazlar[0]?.isim || 'Bilinmiyor',
      message: uyari.mesaj,
      severity: uyari.uyari_seviyesi.toLowerCase(),
      status: uyari.durum.toLowerCase(),
      timestamp: new Date(uyari.created_at).toLocaleString(),
      detectionType: uyari.tespit?.tespit_tipi || 'Bilinmiyor',
      confidence: uyari.tespit?.guven_skoru || 0,
    }));
  }, [data]);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesSearch =
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.deviceName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
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

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'warning':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Açık';
      case 'acknowledged':
        return 'Onaylandı';
      case 'resolved':
        return 'Çözüldü';
      default:
        return status;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Kritik';
      case 'warning':
        return 'Uyarı';
      case 'info':
        return 'Bilgi';
      default:
        return severity;
    }
  };

  if (loading) {
    return <p>Veriler yükleniyor...</p>;
  }

  if (error) {
    return <p>Hata: {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center">
          <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Uyarılar</h2>
        </div>

        <div className="mt-2 sm:mt-0 flex items-center">
          <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{filteredAlerts.filter((a) => a.status === 'open').length}</span> açık uyarı
          </span>
          <span className="h-5 border-l border-gray-300 dark:border-gray-600 mx-2"></span>
          <button className="text-sm text-green-600 hover:text-green-700 dark:text-green-500 hover:underline">
            Tümünü Görüntüle
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Uyarılarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="open">Açık</option>
              <option value="acknowledged">Onaylandı</option>
              <option value="resolved">Çözüldü</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <Filter className="h-4 w-4" />
            </div>
          </div>

          <div className="relative">
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">Tüm Önem Seviyeleri</option>
              <option value="critical">Kritik</option>
              <option value="warning">Uyarı</option>
              <option value="info">Bilgi</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <Filter className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 transition-colors duration-200"
            style={{
              borderLeftColor:
                alert.severity === 'critical'
                  ? '#ef4444'
                  : alert.severity === 'warning'
                  ? '#f97316'
                  : '#3b82f6',
            }}
          >
            <div className="p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {alert.message}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{alert.deviceName}</span>
                      <span className="mx-1">•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-2 md:mt-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadgeClass(alert.severity)} mr-2`}>
                    {getSeverityText(alert.severity)}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(alert.status)}`}>
                    {getStatusText(alert.status)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between">
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    <strong>Tespit:</strong> {alert.detectionType}
                  </span>
                  <span>
                    <strong>Güven Skoru:</strong> %{alert.confidence}
                  </span>
                </div>
                
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  {alert.status === 'open' && (
                    <>
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Onayla
                      </button>
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <XCircle className="h-4 w-4 mr-1" />
                        Çöz
                      </button>
                    </>
                  )}
                  
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Detaylar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center transition-colors duration-200">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Uyarı Bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Seçilen filtrelere göre uyarı bulunmamaktadır.
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterSeverity('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Tüm Uyarıları Göster
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredAlerts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Toplam <span className="font-medium">{filteredAlerts.length}</span> uyarı
          </div>

          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
              Önceki
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-green-600 dark:text-green-400 font-medium">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;