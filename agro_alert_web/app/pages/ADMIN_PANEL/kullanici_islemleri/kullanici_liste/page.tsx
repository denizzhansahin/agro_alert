'use client';

import { Suspense } from 'react';
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@apollo/client';
import { GET_ALL_KULLANICILAR } from '@/app/GraphQl/Kullanici.graphql';

interface Kullanici {
  id: number;
  nickname: string;
  isim: string;
  soyisim: string;
  sehir: string;
  ilce: string;
  tam_adres: string;
  tel_no: number;
  profil_foto_base64: string;
  eposta: string;
  sifre: string;
  role: string;
  created_at: string;
  updated_at: string;
  hekim?: { id: number; created_at: string };
  hasta?: { id: number; created_at: string };
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', description: 'Kullanıcının ID bilgisidir.', width: 80 },
  { field: 'nickname', headerName: 'Kullanıcı Adı', description: 'Kullanıcının, kullanıcı adı bilgisidir.', width: 150 },
  { field: 'isim', headerName: 'İsim', description: 'Kullanıcının, isim bilgisidir.', width: 150 },
  { field: 'soyisim', headerName: 'Soyisim', description: 'Kullanıcının, soyisim bilgisidir.', width: 150 },
  { field: 'sehir', headerName: 'Şehir', description: 'Kullanıcının, şehir bilgisidir.', width: 150 },
  { field: 'ilce', headerName: 'İlçe', description: 'Kullanıcının, ilçe bilgisidir.', width: 150 },
  { field: 'tam_adres', headerName: 'Tam Adres', description: 'Kullanıcının, tam adres bilgisidir.', width: 150 },
  { field: 'tel_no', headerName: 'Telefon', description: 'Kullanıcının, telefon numarası bilgisidir.', width: 150 },
  { field: 'eposta', headerName: 'E-Posta', description: 'Kullanıcının, e-posta adresi bilgisidir.', width: 150 },
  { field: 'role', headerName: 'Rol', description: 'Kullanıcının, rol bilgisidir.', width: 150 },
  { field: 'created_at', headerName: 'Oluşturma Tarihi', description: 'Kullanıcının, sistem üzerinde oluşturulma tarihi bilgisidir.', width: 150 },
  { field: 'updated_at', headerName: 'Güncellenme Tarihi', description: 'Kullanıcının, güncellenme tarihi bilgisidir.', width: 150 },
];

const paginationModel = { page: 0, pageSize: 50 };

function DataTable() {
  const { data, loading, error } = useQuery<{ kullanicilar: Kullanici[] }>(GET_ALL_KULLANICILAR);

  const rows = React.useMemo(() => {
    return (data?.kullanicilar || []).map((kullanici) => ({
      id: kullanici.id,
      nickname: kullanici.nickname,
      isim: kullanici.isim,
      soyisim: kullanici.soyisim,
 
      sehir: kullanici.sehir,
      ilce: kullanici.ilce,
      tam_adres: kullanici.tam_adres,
      tel_no: kullanici.tel_no,
   
      eposta: kullanici.eposta,
      role: kullanici.role,
      created_at: new Date(kullanici.created_at).toLocaleString(),
      updated_at: new Date(kullanici.updated_at).toLocaleString(),
    }));
  }, [data]);

  if (error) {
    return <div><p>Veriler yüklenirken bir hata oluştu: {error.message}</p></div>;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Veriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <Paper sx={{ height: 800, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default function PageKullaniciTable() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTable />
    </Suspense>
  );
}