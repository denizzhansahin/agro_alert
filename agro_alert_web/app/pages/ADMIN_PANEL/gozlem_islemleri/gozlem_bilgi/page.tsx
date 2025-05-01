'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GOZLEM_BY_ID } from '@/app/GraphQl/Gozlem.graphql';
import { TextField, Box, Button, Typography } from '@mui/material';

export default function GozlemBilgi() {
  const [gozlemId, setGozlemId] = useState('');
  const { data, loading, error, refetch } = useQuery(GET_GOZLEM_BY_ID, {
    variables: { id: parseInt(gozlemId) },
    skip: !gozlemId,
  });

  const handleFetchData = async () => {
    if (gozlemId) {
      await refetch({ id: parseInt(gozlemId) });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gözlem Bilgisi
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
          onClick={handleFetchData}
        >
          Bilgileri Getir
        </Button>
      </Box>
      {loading && <Typography>Veriler yükleniyor...</Typography>}
      {error && <Typography color="error">Hata: {error.message}</Typography>}
      {data && data.gozlemById && (
        <Box>
          <Typography variant="h6">Gözlem Bilgileri:</Typography>
          <Typography><strong>ID:</strong> {data.gozlemById.id}</Typography>
          <Typography><strong>Gözlem Tipi:</strong> {data.gozlemById.gozlem_tipi}</Typography>
          <Typography><strong>Sayısal Değer:</strong> {data.gozlemById.sayisal_deger}</Typography>
          <Typography><strong>Metin Değer:</strong> {data.gozlemById.metin_deger}</Typography>
          <Typography><strong>Resim (Base64):</strong> {data.gozlemById.resim_base64}</Typography>
          <Typography><strong>GPS Enlem:</strong> {data.gozlemById.gps_enlem}</Typography>
          <Typography><strong>GPS Boylam:</strong> {data.gozlemById.gps_boylam}</Typography>
          <Typography><strong>Oluşturma Tarihi:</strong> {new Date(data.gozlemById.created_at).toLocaleString()}</Typography>
          <Typography><strong>Güncellenme Tarihi:</strong> {new Date(data.gozlemById.updated_at).toLocaleString()}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Cihaz Kullanıcı Bilgileri:</Typography>
          <Typography><strong>Kullanıcı İsim:</strong> {data.gozlemById.cihaz_kullanici.kullanici.isim}</Typography>
          <Typography><strong>Kullanıcı Soyisim:</strong> {data.gozlemById.cihaz_kullanici.kullanici.soyisim}</Typography>
          <Typography><strong>Kullanıcı E-posta:</strong> {data.gozlemById.cihaz_kullanici.kullanici.eposta}</Typography>
          <Typography><strong>Cihazlar:</strong> {data.gozlemById.cihaz_kullanici.cihazlar.map((cihaz: any) => cihaz.isim).join(', ')}</Typography>
        </Box>
      )}
    </Box>
  );
}