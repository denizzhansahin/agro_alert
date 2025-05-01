'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REMOVE_CIHAZ_FROM_KULLANICI } from '@/app/GraphQl/CihazKullanici.graphql';
import { TextField, Box, Button, Typography } from '@mui/material';

export default function CihazKullaniciCihazKaldir() {
  const [kullaniciId, setKullaniciId] = useState('');
  const [cihazId, setCihazId] = useState('');
  const [removeCihazFromKullanici, { loading, error, data }] = useMutation(REMOVE_CIHAZ_FROM_KULLANICI);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await removeCihazFromKullanici({
        variables: { kullaniciId: parseInt(kullaniciId), cihazId: parseInt(cihazId) },
      });
      alert('Cihaz başarıyla kullanıcıdan kaldırıldı!');
    } catch (err) {
      console.error('Cihaz kaldırma işlemi sırasında hata oluştu:', err);
      alert('Cihaz kullanıcıdan kaldırılamadı!');
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
        Cihaz Kullanıcıdan Kaldır
      </Typography>

      <TextField
        fullWidth
        type="number"
        value={kullaniciId}
        onChange={(e) => setKullaniciId(e.target.value)}
        label="Kullanıcı ID"
        required
      />

      <TextField
        fullWidth
        type="number"
        value={cihazId}
        onChange={(e) => setCihazId(e.target.value)}
        label="Cihaz ID"
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
        {loading ? 'Kaldırılıyor...' : 'Cihazı Kaldır'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Hata: {error.message}
        </Typography>
      )}

      {data && (
        <Typography color="success" sx={{ mt: 2 }}>
          Cihaz başarıyla kaldırıldı!
        </Typography>
      )}
    </Box>
  );
}