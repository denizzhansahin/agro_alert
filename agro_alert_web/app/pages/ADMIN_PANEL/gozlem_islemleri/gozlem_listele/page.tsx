'use client';

import { Suspense } from 'react';
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@apollo/client';
import { GET_ALL_GOZLEMLER } from '@/app/GraphQl/Gozlem.graphql';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'gozlem_tipi', headerName: 'Gözlem Tipi', width: 150 },
  { field: 'sayisal_deger', headerName: 'Sayısal Değer', width: 150 },
  { field: 'metin_deger', headerName: 'Metin Değer', width: 150 },
  { field: 'resim_base64', headerName: 'Resim (Base64)', width: 150 },
  { field: 'gps_enlem', headerName: 'GPS Enlem', width: 150 },
  { field: 'gps_boylam', headerName: 'GPS Boylam', width: 150 },
  { field: 'created_at', headerName: 'Oluşturma Tarihi', width: 150 },
  { field: 'updated_at', headerName: 'Güncellenme Tarihi', width: 150 },
  { field: 'kullanici_isim', headerName: 'Kullanıcı İsim', width: 150 },
  { field: 'kullanici_eposta', headerName: 'Kullanıcı E-posta', width: 200 },
  { field: 'cihazlar', headerName: 'Cihazlar', width: 300 },
];

const paginationModel = { page: 0, pageSize: 50 };

function DataTable() {
  const { data, loading, error } = useQuery(GET_ALL_GOZLEMLER);

  const rows = React.useMemo(() => {
    return (data?.allGozlemler || []).map((record: any) => ({
      id: record.id,
      gozlem_tipi: record.gozlem_tipi,
      sayisal_deger: record.sayisal_deger,
      metin_deger: record.metin_deger,
      resim_base64: record.resim_base64,
      gps_enlem: record.gps_enlem,
      gps_boylam: record.gps_boylam,
      created_at: new Date(record.created_at).toLocaleString(),
      updated_at: new Date(record.updated_at).toLocaleString(),
      kullanici_isim: `${record.cihaz_kullanici.kullanici.isim} ${record.cihaz_kullanici.kullanici.soyisim}`,
      kullanici_eposta: record.cihaz_kullanici.kullanici.eposta,
      cihazlar: record.cihaz_kullanici.cihazlar.map((cihaz: any) => cihaz.isim).join(', '),
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

export default function GozlemListele() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTable />
    </Suspense>
  );
}