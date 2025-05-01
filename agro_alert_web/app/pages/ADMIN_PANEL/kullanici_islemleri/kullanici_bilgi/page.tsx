"use client";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_KULLANICI_BY_ID } from '@/app/GraphQl/Kullanici.graphql';
import { Button, Typography } from '@mui/material';

export default function KullaniciBilgi() {
  const [kullaniciId, setKullaniciId] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_KULLANICI_BY_ID, {
    variables: { id: parseInt(kullaniciId) },
    skip: !kullaniciId,
  });

  const handleFetchData = async () => {
    if (kullaniciId) {
      await refetch({ id: parseInt(kullaniciId) });
    }
  };

  console.log("Data:", data);
  console.log("Loading:", loading);
  console.log("Error:", error);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Kullanıcı Bilgisi
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
          onClick={handleFetchData}
        >
          Kullanıcı Bilgisi Getir
        </Button>
      </Box>
      {loading && <Typography>Veriler yükleniyor...</Typography>}
      {error && <Typography color="error">Hata: {error.message}</Typography>}
      {data && data.kullaniciBul && (
        <Box>
          <Typography variant="h6">Kullanıcı Bilgileri:</Typography>
          <Typography><strong>ID:</strong> {data.kullaniciBul.id}</Typography>
          <Typography><strong>İsim:</strong> {data.kullaniciBul.isim}</Typography>
          <Typography><strong>Soyisim:</strong> {data.kullaniciBul.soyisim}</Typography>
          <Typography><strong>Şehir:</strong> {data.kullaniciBul.sehir}</Typography>
          <Typography><strong>İlçe:</strong> {data.kullaniciBul.ilce}</Typography>
          <Typography><strong>Adres:</strong> {data.kullaniciBul.tam_adres}</Typography>
          <Typography><strong>Telefon:</strong> {data.kullaniciBul.tel_no}</Typography>
          <Typography><strong>E-posta:</strong> {data.kullaniciBul.eposta}</Typography>
          <Typography><strong>Rol:</strong> {data.kullaniciBul.role}</Typography>
          <Typography><strong>Oluşturma Tarihi:</strong> {new Date(data.kullaniciBul.created_at).toLocaleString()}</Typography>
          <Typography><strong>Güncellenme Tarihi:</strong> {new Date(data.kullaniciBul.updated_at).toLocaleString()}</Typography>
        </Box>
      )}
    </Box>
  );
}