'use client';

import {  useState } from 'react';
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@apollo/client';
import { GET_ALL_CIHAZ_KULLANICILAR } from '@/app/GraphQl/CihazKullanici.graphql';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';



const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'kullanici_isim', headerName: 'Kullanıcı İsim', width: 150 },
  { field: 'kullanici_eposta', headerName: 'Kullanıcı E-posta', width: 200 },
  { field: 'cihazlar', headerName: 'Cihazlar', width: 300 },
  { field: 'created_at', headerName: 'Oluşturma Tarihi', width: 150 },
  { field: 'updated_at', headerName: 'Güncellenme Tarihi', width: 150 },
];

const paginationModel = { page: 0, pageSize: 50 };

function DataTable() {
  const { data, loading, error } = useQuery<{ allCihazKullanicilar: any[] }>(GET_ALL_CIHAZ_KULLANICILAR);

  const rows = React.useMemo(() => {
    interface Cihaz {
      isim: string;
    }

    interface Kullanici {
      isim: string;
      soyisim: string;
      eposta: string;
    }

    interface CihazKullaniciRecord {
      id: string;
      kullanici: Kullanici;
      cihazlar: Cihaz[];
      created_at: string;
      updated_at: string;
    }

    interface Row {
      id: string;
      kullanici_isim: string;
      kullanici_eposta: string;
      cihazlar: string;
      created_at: string;
      updated_at: string;
    }

    return (data?.allCihazKullanicilar || []).map((record: CihazKullaniciRecord): Row => ({
      id: record.id,
      kullanici_isim: `${record.kullanici.isim} ${record.kullanici.soyisim}`,
      kullanici_eposta: record.kullanici.eposta,
      cihazlar: record.cihazlar.map((cihaz) => cihaz.isim).join(', '),
      created_at: new Date(record.created_at).toLocaleString(),
      updated_at: new Date(record.updated_at).toLocaleString(),
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

export default function CihazKullaniciListesi() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cihaz Kullanıcı Listesi
      </Typography>
      <DataTable />
    </Box>
  );
}