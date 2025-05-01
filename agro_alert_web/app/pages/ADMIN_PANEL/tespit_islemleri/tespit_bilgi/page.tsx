'use client';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TESPIT_BY_ID } from '@/app/GraphQl/Tespit.graphql';
import { Button, Typography } from '@mui/material';

export default function TespitBilgi() {
  const [tespitId, setTespitId] = useState('');
  const { data, loading, error, refetch } = useQuery(GET_TESPIT_BY_ID, {
    variables: { id: parseInt(tespitId) },
    skip: !tespitId,
  });

  const handleFetchData = async () => {
    if (tespitId) {
      await refetch({ id: parseInt(tespitId) });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tespit Bilgisi
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
          Tespit Bilgisi Getir
        </Button>
      </Box>
      {loading && <Typography>Veriler yükleniyor...</Typography>}
      {error && <Typography color="error">Hata: {error.message}</Typography>}
      {data && data.tespitById && (
        <Box>
          <Typography variant="h6">Tespit Bilgileri:</Typography>
          <Typography><strong>ID:</strong> {data.tespitById.id}</Typography>
          <Typography><strong>Tespit Tipi:</strong> {data.tespitById.tespit_tipi}</Typography>
          <Typography><strong>Güven Skoru:</strong> {data.tespitById.guven_skoru}</Typography>
          <Typography><strong>Sınırlayıcı Kutu Verisi:</strong> {data.tespitById.sinirlayici_kutu_verisi}</Typography>
          <Typography><strong>Oluşturma Tarihi:</strong> {new Date(data.tespitById.created_at).toLocaleString()}</Typography>
          <Typography><strong>Güncellenme Tarihi:</strong> {new Date(data.tespitById.updated_at).toLocaleString()}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Gözlem Bilgileri:</Typography>
          <Typography><strong>Gözlem ID:</strong> {data.tespitById.gozlem.id}</Typography>
          <Typography><strong>Gözlem Tipi:</strong> {data.tespitById.gozlem.gozlem_tipi}</Typography>
          <Typography><strong>Sayısal Değer:</strong> {data.tespitById.gozlem.sayisal_deger}</Typography>
          <Typography><strong>Metin Değer:</strong> {data.tespitById.gozlem.metin_deger}</Typography>
        </Box>
      )}
    </Box>
  );
}