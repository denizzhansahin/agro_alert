'use client';

import { Suspense } from 'react';
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@apollo/client';
import { GET_ALL_CIHAZLAR } from '@/app/GraphQl/Cihazlar.graphql';

interface Cihaz {
  id: number;
  cihaz_seri_no: string;
  isim: string;
  durum: string;
  konum_enlem: number | null;
  konum_boylam: number | null;
  son_gorulme: string | null;
  created_at: string;
  updated_at: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'cihaz_seri_no', headerName: 'Seri No', width: 150 },
  { field: 'isim', headerName: 'İsim', width: 150 },
  { field: 'durum', headerName: 'Durum', width: 150 },
  { field: 'konum_enlem', headerName: 'Enlem', width: 150 },
  { field: 'konum_boylam', headerName: 'Boylam', width: 150 },
  { field: 'son_gorulme', headerName: 'Son Görülme', width: 150 },
  { field: 'created_at', headerName: 'Oluşturma Tarihi', width: 150 },
  { field: 'updated_at', headerName: 'Güncellenme Tarihi', width: 150 },
];

const paginationModel = { page: 0, pageSize: 50 };

function DataTable() {
  const { data, loading, error } = useQuery<{ getAllCihazlar: Cihaz[] }>(GET_ALL_CIHAZLAR);

  const rows = React.useMemo(() => {
    return (data?.getAllCihazlar || []).map((cihaz) => ({
      id: cihaz.id,
      cihaz_seri_no: cihaz.cihaz_seri_no,
      isim: cihaz.isim,
      durum: cihaz.durum,
      konum_enlem: cihaz.konum_enlem,
      konum_boylam: cihaz.konum_boylam,
      son_gorulme: cihaz.son_gorulme ? new Date(cihaz.son_gorulme).toLocaleString() : null,
      created_at: new Date(cihaz.created_at).toLocaleString(),
      updated_at: new Date(cihaz.updated_at).toLocaleString(),
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

export default function PageCihazlarTable() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTable />
    </Suspense>
  );
}