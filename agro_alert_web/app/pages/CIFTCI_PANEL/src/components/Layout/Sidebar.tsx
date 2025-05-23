import React, { useEffect, useState } from 'react';
import { LayoutGrid, Cpu, BarChart2, AlertTriangle, User, Tractor, Search } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_KULLANICI_BY_ID } from '@/app/GraphQl/Kullanici.graphql';

interface SidebarProps {
  navigateTo: (page: string) => void;
  currentPage: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}



const Sidebar: React.FC<SidebarProps> = ({ navigateTo, currentPage }) => {
  const navItems: NavItem[] = [
    { name: 'Gösterge Paneli', path: 'dashboard', icon: <LayoutGrid size={20} /> },
    { name: 'Cihazlar', path: 'devices', icon: <Cpu size={20} /> },
    { name: 'Gözlemler', path: 'observations', icon: <BarChart2 size={20} /> },
    { name: 'Uyarılar', path: 'alerts', icon: <AlertTriangle size={20} /> },
    { name: 'Profil', path: 'profile', icon: <User size={20} /> },
    { name: 'Tespitler', path: 'tespit', icon: <Search size={20} /> }, // Add Tespitler navigation item
  ];


  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.id) {
      setUserId(storedUser.id);
    }
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_KULLANICI_BY_ID, {
      variables: { id: userId },
      fetchPolicy: 'cache-and-network',
    });

      const [formData, setFormData] = useState({
        nickname: '',
        name: '',
        surname: '',
        city: '',
        district: '',
        address: '',
        phone: '',
        email: '',
        role: '',
      });

      useEffect(() => {
          if (data?.kullaniciBul) {
            const user = data.kullaniciBul;
            setFormData({
              nickname: user.nickname,
              name: user.isim,
              surname: user.soyisim,
              city: user.sehir,
              district: user.ilce,
              address: user.tam_adres,
              phone: user.tel_no,
              email: user.eposta,
              role: user.role,
            });
          }
        }, [data]);

  return (
    <aside className="z-20 flex-shrink-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="h-full flex flex-col">
        <div className="py-6 px-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <Tractor className="h-8 w-8 text-green-600 mr-2" />
          <span className="text-xl font-semibold text-gray-800 dark:text-white">Agro Alert System</span>
        </div>

        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigateTo(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ${currentPage === item.path
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>


                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-4 py-4 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white font-medium">{formData.name[0]}{formData.surname[0]}</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{formData.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formData.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;