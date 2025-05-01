'use client';

import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@apollo/client';
import { GET_UYARI_BY_TESPIT_ID } from '@/app/GraphQl/Uyari.graphql';
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

function DataTable({ tespitId }: { tespitId: number }) {
  const { data, loading, error } = useQuery(GET_UYARI_BY_TESPIT_ID, {
    variables: { tespitId },
    skip: !tespitId,
  });

  const rows = data?.uyariByTespitId
    ? [
        {
          id: data.uyariByTespitId.id,
          uyari_seviyesi: data.uyariByTespitId.uyari_seviyesi,
          mesaj: data.uyariByTespitId.mesaj,
          durum: data.uyariByTespitId.durum,
          created_at: new Date(data.uyariByTespitId.created_at).toLocaleString(),
          updated_at: new Date(data.uyariByTespitId.updated_at).toLocaleString(),
          tespit_tipi: data.uyariByTespitId.tespit?.tespit_tipi || 'N/A',
          guven_skoru: data.uyariByTespitId.tespit?.guven_skoru || 'N/A',
        },
      ]
    : [];

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
    <Paper sx={{ height: 400, width: '100%' }}>
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

export default function UyariByTespitId() {
  const [tespitId, setTespitId] = useState('');
  const { data, loading, error, refetch } = useQuery(GET_UYARI_BY_TESPIT_ID, {
    variables: { tespitId: parseInt(tespitId) },
    skip: !tespitId,
  });

  const handleFetchData = async () => {
    if (tespitId) {
      await refetch({ tespitId: parseInt(tespitId) });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tespit ID'ye Göre Uyarılar
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <TextField
          fullWidth
          type="number"
          value={tespitId}
          onChange={(e) => setTespitId(e.target.value)}
          helperText="Tespit ID'sini girin."
          label="Tespit ID"
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchData}
        >
          Bilgileri Getir
        </Button>
      </Box>

      {loading && <Typography>Veriler yükleniyor...</Typography>}
      {error && <Typography color="error">Hata: {error.message}</Typography>}

      {data && data.uyariByTespitId && (
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6">Uyarı Detayları:</Typography>
          <Typography><strong>ID:</strong> {data.uyariByTespitId.id}</Typography>
          <Typography><strong>Uyarı Seviyesi:</strong> {data.uyariByTespitId.uyari_seviyesi}</Typography>
          <Typography><strong>Mesaj:</strong> {data.uyariByTespitId.mesaj}</Typography>
          <Typography><strong>Durum:</strong> {data.uyariByTespitId.durum}</Typography>
          <Typography><strong>Oluşturma Tarihi:</strong> {new Date(data.uyariByTespitId.created_at).toLocaleString()}</Typography>
          <Typography><strong>Güncellenme Tarihi:</strong> {new Date(data.uyariByTespitId.updated_at).toLocaleString()}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Tespit Bilgileri:</Typography>
          <Typography><strong>Tespit ID:</strong> {data.uyariByTespitId.tespit?.id || 'N/A'}</Typography>
          <Typography><strong>Tespit Tipi:</strong> {data.uyariByTespitId.tespit?.tespit_tipi || 'N/A'}</Typography>
          <Typography><strong>Güven Skoru:</strong> {data.uyariByTespitId.tespit?.guven_skoru || 'N/A'}</Typography>
        </Box>
      )}

      {tespitId && <DataTable tespitId={parseInt(tespitId)} />}
    </Box>
  );
}