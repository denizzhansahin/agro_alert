'use client';

import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery } from '@apollo/client';
import { GET_TESPITLER_BY_GOZLEM_ID } from '@/app/GraphQl/Tespit.graphql';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'tespit_tipi', headerName: 'Tespit Tipi', width: 150 },
  { field: 'guven_skoru', headerName: 'Güven Skoru', width: 150 },
  { field: 'sinirlayici_kutu_verisi', headerName: 'Sınırlayıcı Kutu Verisi', width: 200 },
  { field: 'created_at', headerName: 'Oluşturma Tarihi', width: 150 },
  { field: 'updated_at', headerName: 'Güncellenme Tarihi', width: 150 },
];

function DataTable({ gozlemId }: { gozlemId: number }) {
  const { data, loading, error } = useQuery(GET_TESPITLER_BY_GOZLEM_ID, {
    variables: { gozlemId },
    skip: !gozlemId,
  });

  const rows = (data?.tespitlerByGozlemId || []).map((record: any) => ({
    id: record.id,
    tespit_tipi: record.tespit_tipi,
    guven_skoru: record.guven_skoru,
    sinirlayici_kutu_verisi: record.sinirlayici_kutu_verisi,
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

export default function TespitListele() {
  const [gozlemId, setGozlemId] = useState('');

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gözleme Göre Tespitler
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <TextField
          fullWidth
          type="number"
          value={gozlemId}
          onChange={(e) => setGozlemId(e.target.value)}
          helperText="Gözlem ID'sini girin."
          label="Gözlem ID"
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setGozlemId(gozlemId)}
        >
          Listeyi Getir
        </Button>
      </Box>
      {gozlemId && <DataTable gozlemId={parseInt(gozlemId)} />}
    </Box>
  );
}