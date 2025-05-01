'use client';

import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@apollo/client';
import { GET_UYARILAR_BY_KULLANICI_ID } from '@/app/GraphQl/Uyari.graphql';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'uyari_seviyesi', headerName: 'Uyarı Seviyesi', width: 150 },
  { field: 'mesaj', headerName: 'Mesaj', width: 300 },
  { field: 'durum', headerName: 'Durum', width: 150 },
  { field: 'created_at', headerName: 'Oluşturma Tarihi', width: 150 },
  { field: 'updated_at', headerName: 'Güncellenme Tarihi', width: 150 },
  { field: 'tespit_tipi', headerName: 'Tespit Tipi', width: 150 },
  { field: 'guven_skoru', headerName: 'Güven Skoru', width: 150 },
];

function DataTable({ kullaniciId }: { kullaniciId: number }) {
  const { data, loading, error } = useQuery(GET_UYARILAR_BY_KULLANICI_ID, {
    variables: { kullaniciId },
    skip: !kullaniciId,
  });

  const rows = (data?.uyarilarByKullaniciId || []).map((record: any) => ({
    id: record.id,
    uyari_seviyesi: record.uyari_seviyesi,
    mesaj: record.mesaj,
    durum: record.durum,
    created_at: new Date(record.created_at).toLocaleString(),
    updated_at: new Date(record.updated_at).toLocaleString(),
    tespit_tipi: record.tespit?.tespit_tipi || 'N/A',
    guven_skoru: record.tespit?.guven_skoru || 'N/A',
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

export default function UyarilarByKullaniciListe() {
  const [kullaniciId, setKullaniciId] = useState('');

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Kullanıcıya Göre Uyarılar
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