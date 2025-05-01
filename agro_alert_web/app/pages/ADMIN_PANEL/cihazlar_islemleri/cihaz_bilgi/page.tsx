"use client";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CIHAZ_BY_ID } from '@/app/GraphQl/Cihazlar.graphql';
import { Button, Typography } from '@mui/material';

export default function CihazBilgi() {
  const [cihazId, setCihazId] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_CIHAZ_BY_ID, {
    variables: { id: parseInt(cihazId) },
    skip: !cihazId,
  });

  const handleFetchData = async () => {
    if (cihazId) {
      await refetch({ id: parseInt(cihazId) });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cihaz Bilgisi
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <TextField
          fullWidth
          type="number"
          value={cihazId}
          onChange={(e) => setCihazId(e.target.value)}
          helperText="Cihaz ID'sini girin."
          label="Cihaz ID"
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchData}
        >
          Cihaz Bilgisi Getir
        </Button>
      </Box>
      {loading && <Typography>Veriler yükleniyor...</Typography>}
      {error && <Typography color="error">Hata: {error.message}</Typography>}
      {data && (
        <Box>
          <Typography variant="h6">Cihaz Bilgileri:</Typography>
          <Typography><strong>ID:</strong> {data.getCihazById.id}</Typography>
          <Typography><strong>Seri No:</strong> {data.getCihazById.cihaz_seri_no}</Typography>
          <Typography><strong>İsim:</strong> {data.getCihazById.isim}</Typography>
          <Typography><strong>Durum:</strong> {data.getCihazById.durum}</Typography>
          <Typography><strong>Enlem:</strong> {data.getCihazById.konum_enlem}</Typography>
          <Typography><strong>Boylam:</strong> {data.getCihazById.konum_boylam}</Typography>
          <Typography><strong>Son Görülme:</strong> {data.getCihazById.son_gorulme ? new Date(data.getCihazById.son_gorulme).toLocaleString() : "N/A"}</Typography>
          <Typography><strong>Oluşturma Tarihi:</strong> {new Date(data.getCihazById.created_at).toLocaleString()}</Typography>
          <Typography><strong>Güncellenme Tarihi:</strong> {new Date(data.getCihazById.updated_at).toLocaleString()}</Typography>
          {data.getCihazById.cihaz_kullanici && (
            <>
              <Typography variant="h6" sx={{ marginTop: 2 }}>Cihaz Kullanıcı Bilgileri:</Typography>
              <Typography><strong>Kullanıcı ID:</strong> {data.getCihazById.cihaz_kullanici.kullanici.id}</Typography>
              <Typography><strong>İsim:</strong> {data.getCihazById.cihaz_kullanici.kullanici.isim}</Typography>
              <Typography><strong>Soyisim:</strong> {data.getCihazById.cihaz_kullanici.kullanici.soyisim}</Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}