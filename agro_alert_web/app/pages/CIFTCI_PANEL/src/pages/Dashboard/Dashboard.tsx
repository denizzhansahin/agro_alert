import React, { useMemo, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID } from '@/app/GraphQl/Gozlem.graphql';
import { GET_UYARILAR_BY_KULLANICI_ID } from '@/app/GraphQl/Uyari.graphql';
import { GET_CIHAZ_KULLANICI_BY_KULLANICI_ID } from '@/app/GraphQl/CihazKullanici.graphql';
import StatCard from '../../components/UI/StatCard';
import BarChart from '../../components/Charts/BarChart';
import DonutChart from '../../components/Charts/DonutChart';
import { Cpu, AlertTriangle, BarChart2, MapPin } from 'lucide-react';
import DeviceStatusCard from './DeviceStatusCard';
import AlertPreview from './AlertPreview';
import WeatherWidget from './WeatherWidget';

const Dashboard = () => {
  const [kullaniciId, setKullaniciId] = useState<number | null>(null);
  const [cihazKullaniciId, setCihazKullaniciId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (storedUser?.id) {
      setKullaniciId(storedUser.id);
      setCihazKullaniciId(storedUser.cihazKullaniciId || null);
    }
  }, []);

  const { data: cihazData, loading: cihazLoading } = useQuery(GET_CIHAZ_KULLANICI_BY_KULLANICI_ID, {
    variables: { kullaniciId },
    skip: !kullaniciId,
  });

  console.log('Cihaz Data:', cihazData);
  const { data: gozlemData, loading: gozlemLoading } = useQuery(GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID, {
    variables: { cihazKullaniciId },
    skip: !cihazKullaniciId,
  });

  const { data: uyariData, loading: uyariLoading } = useQuery(GET_UYARILAR_BY_KULLANICI_ID, {
    variables: { kullaniciId },
    skip: !kullaniciId,
  });

  const devices = useMemo(() => {
    if (!cihazData?.cihazKullaniciByKullaniciId?.cihazlar) return [];
    return cihazData.cihazKullaniciByKullaniciId.cihazlar.map((cihaz: any) => ({
      id: cihaz.id,
      name: cihaz.isim,
      status: cihaz.durum.toLowerCase(),
      lastSeen: cihaz.son_gorulme ? new Date(cihaz.son_gorulme).toLocaleString() : 'Bilinmiyor',
      serialNo: cihaz.cihaz_seri_no,
    }));
  }, [cihazData]);

  const observations = useMemo(() => {
    if (!gozlemData?.gozlemlerByCihazKullaniciId) return [];
    return gozlemData.gozlemlerByCihazKullaniciId.map((gozlem: any) => ({
      id: gozlem.id,
      type: gozlem.gozlem_tipi,
      value: gozlem.sayisal_deger || gozlem.metin_deger || 'N/A',
      timestamp: new Date(gozlem.created_at).toLocaleString(),
    }));
  }, [gozlemData]);

  const alerts = useMemo(() => {
    if (!uyariData?.uyarilarByKullaniciId) return [];
    return uyariData.uyarilarByKullaniciId.map((uyari: any) => ({
      id: uyari.id,
      level: uyari.uyari_seviyesi.toLowerCase(),
      message: uyari.mesaj,
      deviceName: uyari.tespit?.gozlem?.cihaz_kullanici?.cihazlar[0]?.isim || 'Bilinmiyor',
      time: new Date(uyari.created_at).toLocaleString(),
    }));
  }, [uyariData]);

  const totalDevices = devices.length;
  const totalAlerts = alerts.length;
  const totalObservations = observations.length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Gösterge Paneli</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Cihaz"
          value={cihazLoading ? '...' : totalDevices.toString()}
          trend="+1"
          trendUp={true}
          icon={<Cpu className="h-6 w-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Aktif Uyarılar"
          value={uyariLoading ? '...' : totalAlerts.toString()}
          trend="-2"
          trendUp={false}
          icon={<AlertTriangle className="h-6 w-6 text-orange-600" />}
          color="orange"
        />
        <StatCard
          title="Bugünkü Gözlemler"
          value={gozlemLoading ? '...' : totalObservations.toString()}
          trend="+6"
          trendUp={true}
          icon={<BarChart2 className="h-6 w-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="İzlenen Alanlar"
          value="2" // Replace with dynamic data if available
          trend="0"
          trendUp={true}
          icon={<MapPin className="h-6 w-6 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Status Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Cihaz Durumları</h3>
              <button className="text-sm text-green-600 hover:text-green-700 dark:text-green-500 hover:underline">
                Tümünü Gör
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devices.map((device) => (
                <DeviceStatusCard key={device.id} device={device} />
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors duration-200">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Günlük Gözlemler</h3>
              <div className="h-60">
                <BarChart />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors duration-200">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Tespit Dağılımı</h3>
              <div className="h-60">
                <DonutChart />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <WeatherWidget />

          {/* Recent Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Son Uyarılar</h3>
              <button className="text-sm text-green-600 hover:text-green-700 dark:text-green-500 hover:underline">
                Tümünü Gör
              </button>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertPreview key={alert.id} alert={alert} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg text-green-700 dark:text-green-300 font-medium transition">
                Cihaz Ekle
              </button>
              <button className="p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-lg text-blue-700 dark:text-blue-300 font-medium transition">
                Rapor Oluştur
              </button>
              <button className="p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900 dark:hover:bg-purple-800 rounded-lg text-purple-700 dark:text-purple-300 font-medium transition">
                Ekip Davet Et
              </button>
              <button className="p-3 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900 dark:hover:bg-orange-800 rounded-lg text-orange-700 dark:text-orange-300 font-medium transition">
                Yardım Merkezi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;