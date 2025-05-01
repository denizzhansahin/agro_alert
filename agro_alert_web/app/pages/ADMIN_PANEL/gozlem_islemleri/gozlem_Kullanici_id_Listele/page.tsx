'use client';

import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@apollo/client';
import { GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID } from '@/app/GraphQl/Gozlem.graphql';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';

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
];

function DataTable({ cihazKullaniciId }: { cihazKullaniciId: number }) {
  const { data, loading, error } = useQuery(GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID, {
    variables: { cihazKullaniciId },
    skip: !cihazKullaniciId,
  });

  const rows = (data?.gozlemlerByCihazKullaniciId || []).map((record: any) => ({
    id: record.id,
    gozlem_tipi: record.gozlem_tipi,
    sayisal_deger: record.sayisal_deger,
    metin_deger: record.metin_deger,
    resim_base64: record.resim_base64,
    gps_enlem: record.gps_enlem,
    gps_boylam: record.gps_boylam,
    created_at: new Date(record.created_at).toLocaleString(),
    updated_at: new Date(record.updated_at).toLocaleString(),
  }));

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
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default function GozlemKullaniciIdListele() {
  const [cihazKullaniciId, setCihazKullaniciId] = useState('');

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cihaz Kullanıcı ID'ye Göre Gözlemler
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <TextField
          fullWidth
          type="number"
          value={cihazKullaniciId}
          onChange={(e) => setCihazKullaniciId(e.target.value)}
          helperText="Cihaz Kullanıcı ID'sini girin."
          label="Cihaz Kullanıcı ID"
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCihazKullaniciId(cihazKullaniciId)}
        >
          Listeyi Getir
        </Button>
      </Box>
      {cihazKullaniciId && <DataTable cihazKullaniciId={parseInt(cihazKullaniciId)} />}
    </Box>
  );
}