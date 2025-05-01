"use client";

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CIHAZ_KULLANICI_BY_ID } from '@/app/GraphQl/CihazKullanici.graphql';
import { Button, Typography } from '@mui/material';

export default function CihazKullaniciBilgi() {
  const [cihazKullaniciId, setCihazKullaniciId] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_CIHAZ_KULLANICI_BY_ID, {
    variables: { id: parseInt(cihazKullaniciId) },
    skip: !cihazKullaniciId,
  });

  const handleFetchData = async () => {
    if (cihazKullaniciId) {
      await refetch({ id: parseInt(cihazKullaniciId) });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cihaz Kullanıcı Bilgisi
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
          onClick={handleFetchData}
        >
          Bilgileri Getir
        </Button>
      </Box>
      {loading && <Typography>Veriler yükleniyor...</Typography>}
      {error && <Typography color="error">Hata: {error.message}</Typography>}
      {data && data.cihazKullaniciById && (
        <Box>
          <Typography variant="h6">Cihaz Kullanıcı Bilgileri:</Typography>
          <Typography><strong>ID:</strong> {data.cihazKullaniciById.id}</Typography>
          <Typography><strong>Kullanıcı İsim:</strong> {data.cihazKullaniciById.kullanici.isim}</Typography>
          <Typography><strong>Kullanıcı Soyisim:</strong> {data.cihazKullaniciById.kullanici.soyisim}</Typography>
          <Typography><strong>Kullanıcı E-posta:</strong> {data.cihazKullaniciById.kullanici.eposta}</Typography>
          <Typography><strong>Cihazlar:</strong> {data.cihazKullaniciById.cihazlar.map((cihaz: any) => cihaz.isim).join(', ')}</Typography>
          <Typography><strong>Oluşturma Tarihi:</strong> {new Date(data.cihazKullaniciById.created_at).toLocaleString()}</Typography>
          <Typography><strong>Güncellenme Tarihi:</strong> {new Date(data.cihazKullaniciById.updated_at).toLocaleString()}</Typography>
        </Box>
      )}
    </Box>
  );
}