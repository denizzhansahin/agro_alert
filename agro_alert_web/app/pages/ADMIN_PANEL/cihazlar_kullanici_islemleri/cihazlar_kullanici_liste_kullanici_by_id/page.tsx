'use client';

import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@apollo/client';
import { GET_CIHAZ_KULLANICI_BY_KULLANICI_ID } from '@/app/GraphQl/CihazKullanici.graphql';
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

function DataTable({ kullaniciId }: { kullaniciId: number }) {
  const { data, loading, error } = useQuery(GET_CIHAZ_KULLANICI_BY_KULLANICI_ID, {
    variables: { kullaniciId },
    skip: !kullaniciId,
  });

  const rows = (data?.cihazKullaniciByKullaniciId ? [data.cihazKullaniciByKullaniciId] : []).map((record) => ({
    id: record.id,
    kullanici_isim: `${record.kullanici.isim} ${record.kullanici.soyisim}`,
    kullanici_eposta: record.kullanici.eposta,
    cihazlar: record.cihazlar.map((cihaz: any) => cihaz.isim).join(', '),
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

export default function CihazKullaniciListeKullaniciById() {
  const [kullaniciId, setKullaniciId] = useState('');

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Kullanıcıya Göre Cihaz Kullanıcı Listesi
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <TextField
          fullWidth
          type="number"
          value={kullaniciId}
          onChange={(e) => setKullaniciId(e.target.value)}
          helperText="Kullanıcı ID'sini girin."
          label="Kullanıcı ID"
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setKullaniciId(kullaniciId)}
        >
          Listeyi Getir
        </Button>
      </Box>
      {kullaniciId && <DataTable kullaniciId={parseInt(kullaniciId)} />}
    </Box>
  );
}