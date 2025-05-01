"use client";

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_UYARI } from '@/app/GraphQl/Uyari.graphql';
import { Button, Typography } from '@mui/material';

export default function UyariOlustur() {
  const [formData, setFormData] = useState({
    kullaniciId: '',
    tespitId: '',
    gozlemId: '',
    uyari_seviyesi: '',
    mesaj: '',
    durum: '',
  });

  const [createUyari, { loading, error, data }] = useMutation(CREATE_UYARI);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createUyari({
        variables: {
          createUyariData: {
            kullaniciId: parseInt(formData.kullaniciId),
            tespitId: formData.tespitId ? parseInt(formData.tespitId) : null,
            gozlemId: formData.gozlemId ? parseInt(formData.gozlemId) : null,
            uyari_seviyesi: formData.uyari_seviyesi,
            mesaj: formData.mesaj,
            durum: formData.durum,
          },
        },
      });
      alert('Uyarı başarıyla oluşturuldu!');
    } catch (err) {
      console.error('Uyarı oluşturulurken hata oluştu:', err);
      alert('Uyarı oluşturulamadı!');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 3,
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Uyarı Oluştur
      </Typography>

      <TextField
        fullWidth
        type="number"
        value={formData.kullaniciId}
        onChange={(e) => setFormData({ ...formData, kullaniciId: e.target.value })}
        label="Kullanıcı ID"
        required
      />

      <TextField
        fullWidth
        type="number"
        value={formData.tespitId}
        onChange={(e) => setFormData({ ...formData, tespitId: e.target.value })}
        label="Tespit ID"
      />

      <TextField
        fullWidth
        type="number"
        value={formData.gozlemId}
        onChange={(e) => setFormData({ ...formData, gozlemId: e.target.value })}
        label="Gözlem ID"
      />

      <TextField
        fullWidth
        value={formData.uyari_seviyesi}
        onChange={(e) => setFormData({ ...formData, uyari_seviyesi: e.target.value })}
        label="Uyarı Seviyesi"
        required
      />

      <TextField
        fullWidth
        value={formData.mesaj}
        onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
        label="Mesaj"
        required
      />

      <TextField
        fullWidth
        value={formData.durum}
        onChange={(e) => setFormData({ ...formData, durum: e.target.value })}
        label="Durum"
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        size="large"
      >
        {loading ? 'Oluşturuluyor...' : 'Uyarı Oluştur'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Hata: {error.message}
        </Typography>
      )}

      {data && (
        <Typography color="success" sx={{ mt: 2 }}>
          Uyarı başarıyla oluşturuldu!
        </Typography>
      )}
    </Box>
  );
}
