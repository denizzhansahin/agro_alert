import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, LogOut } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_KULLANICI_BY_ID, UPDATE_KULLANICI } from '@/app/GraphQl/Kullanici.graphql';
import Link from 'next/link';


const Profile = () => {



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
  const [updateKullanici] = useMutation(UPDATE_KULLANICI);

  const [isEditing, setIsEditing] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateKullanici({
        variables: {
          userId,
          updateUserData: {
            nickname: formData.nickname,
            isim: formData.name,
            soyisim: formData.surname,
            sehir: formData.city,
            ilce: formData.district,
            tam_adres: formData.address,
            tel_no: formData.phone,
            eposta: formData.email,
            role: formData.role,
          },
        },
      });
      alert('Profil başarıyla güncellendi!');
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error('Profil güncellenirken hata oluştu:', err);
      alert('Profil güncellenemedi!');
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Profil {userId}</h2>
        {isEditing ? (
          <button
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            onClick={handleSave}
          >
            <Save className="h-5 w-5 mr-2" />
            Kaydet
          </button>
        ) : (
          <button
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-5 w-5 mr-2" />
            Düzenle
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
        <div className="flex flex-col md:flex-row">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-10">
            <div className="w-32 h-32 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
              <User className="w-16 h-16" />
            </div>
            {isEditing && (
              <button className="mt-4 px-4 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 text-sm font-medium rounded-lg transition">
                Fotoğraf Değiştir
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div className="flex-1 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Kişisel Bilgiler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ad
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{formData.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Soyad
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{formData.surname}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kullanıcı Adı
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{formData.nickname}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rol
                  </label>
                  <p className="text-gray-900 dark:text-white">{formData.role}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta
                  </label>
                  {isEditing ? (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-900 dark:text-white">{formData.email}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefon
                  </label>
                  {isEditing ? (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-900 dark:text-white">{formData.phone}</p>
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adres
                  </label>
                  {isEditing ? (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-2" />
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="city"
                            placeholder="Şehir"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            name="district"
                            placeholder="İlçe"
                            value={formData.district}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <input
                          type="text"
                          name="address"
                          placeholder="Açık Adres"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-gray-900 dark:text-white">{formData.address}</p>
                        <p className="text-gray-900 dark:text-white">{formData.district}, {formData.city}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      {/* 
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Güvenlik</h3>
        
        <div className="space-y-4">
          <button className="w-full md:w-auto px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition">
            Şifre Değiştir
          </button>
          
          <button className="w-full md:w-auto px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition">
            İki Faktörlü Doğrulama
          </button>
        </div>
      </div>
      
      {/* Session and Logout */}
     
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Oturum</h3>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
        <p className="text-gray-600 dark:text-gray-300">Son giriş:...........</p>
        <p className="text-gray-600 dark:text-gray-300">
          IP: {typeof window !== 'undefined' && window.location.hostname}
        </p>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition">
        <LogOut className="h-5 w-5 mr-2" />
        <Link href="/login">
        Çıkış Yap
        </Link>
        
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Profile;