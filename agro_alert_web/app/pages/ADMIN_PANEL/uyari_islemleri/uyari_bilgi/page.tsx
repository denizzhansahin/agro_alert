"use client";

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_UYARI_BY_ID } from '@/app/GraphQl/Uyari.graphql';
import { Button, Typography } from '@mui/material';

export default function UyariBilgi() {
  const [uyariId, setUyariId] = useState('');
  const { data, loading, error, refetch } = useQuery(GET_UYARI_BY_ID, {
    variables: { id: parseInt(uyariId) },
    skip: !uyariId,
  });

  const handleFetchData = async () => {
    if (uyariId) {
      await refetch({ id: parseInt(uyariId) });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Uyarı Bilgisi
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <TextField
          fullWidth
          type="number"
          value={uyariId}
          onChange={(e) => setUyariId(e.target.value)}
          helperText="Uyarı ID'sini girin."
          label="Uyarı ID"
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchData}
        >
          Uyarı Bilgisi Getir
        </Button>
      </Box>
      {loading && <Typography>Veriler yükleniyor...</Typography>}
      {error && <Typography color="error">Hata: {error.message}</Typography>}
      {data && data.uyariById && (
        <Box>
          <Typography variant="h6">Uyarı Bilgileri:</Typography>
          <Typography><strong>ID:</strong> {data.uyariById.id}</Typography>
          <Typography><strong>Uyarı Seviyesi:</strong> {data.uyariById.uyari_seviyesi}</Typography>
          <Typography><strong>Mesaj:</strong> {data.uyariById.mesaj}</Typography>
          <Typography><strong>Durum:</strong> {data.uyariById.durum}</Typography>
          <Typography><strong>Oluşturma Tarihi:</strong> {new Date(data.uyariById.created_at).toLocaleString()}</Typography>
          <Typography><strong>Güncellenme Tarihi:</strong> {new Date(data.uyariById.updated_at).toLocaleString()}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Tespit Bilgileri:</Typography>
          <Typography><strong>Tespit ID:</strong> {data.uyariById.tespit.id}</Typography>
          <Typography><strong>Tespit Tipi:</strong> {data.uyariById.tespit.tespit_tipi}</Typography>
          <Typography><strong>Güven Skoru:</strong> {data.uyariById.tespit.guven_skoru}</Typography>
        </Box>
      )}
    </Box>
  );
}