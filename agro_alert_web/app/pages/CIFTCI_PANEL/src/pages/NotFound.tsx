import React from 'react';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-5">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">404</h2>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Sayfa Bulunamadı</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Lütfen ana sayfaya dönün.
        </p>
        <button 
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          onClick={() => window.location.reload()}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};

export default NotFound;