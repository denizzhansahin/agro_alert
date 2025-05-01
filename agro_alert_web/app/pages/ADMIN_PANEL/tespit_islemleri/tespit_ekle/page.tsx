'use client';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TESPIT } from '@/app/GraphQl/Tespit.graphql';
import { Button, Typography } from '@mui/material';

export default function TespitEkle() {
  const [formData, setFormData] = useState({
    gozlemId: '',
    tespit_tipi: '',
    guven_skoru: '',
    sinirlayici_kutu_verisi: '',
  });

  const [createTespit, { loading, error, data }] = useMutation(CREATE_TESPIT);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createTespit({
        variables: {
          createTespitData: {
            gozlemId: parseInt(formData.gozlemId),
            tespit_tipi: formData.tespit_tipi,
            guven_skoru: formData.guven_skoru ? parseFloat(formData.guven_skoru) : null,
            sinirlayici_kutu_verisi: formData.sinirlayici_kutu_verisi,
          },
        },
      });
      alert('Tespit başarıyla eklendi!');
    } catch (err) {
      console.error('Tespit eklenirken hata oluştu:', err);
      alert('Tespit eklenemedi!');
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
        Tespit Ekle
      </Typography>

      <TextField
        fullWidth
        type="number"
        value={formData.gozlemId}
        onChange={(e) => setFormData({ ...formData, gozlemId: e.target.value })}
        label="Gözlem ID"
        required
      />

      <TextField
        fullWidth
        value={formData.tespit_tipi}
        onChange={(e) => setFormData({ ...formData, tespit_tipi: e.target.value })}
        label="Tespit Tipi"
        required
      />

      <TextField
        fullWidth
        type="number"
        value={formData.guven_skoru}
        onChange={(e) => setFormData({ ...formData, guven_skoru: e.target.value })}
        label="Güven Skoru"
      />

      <TextField
        fullWidth
        value={formData.sinirlayici_kutu_verisi}
        onChange={(e) => setFormData({ ...formData, sinirlayici_kutu_verisi: e.target.value })}
        label="Sınırlayıcı Kutu Verisi"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        size="large"
      >
        {loading ? 'Ekleniyor...' : 'Tespit Ekle'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Hata: {error.message}
        </Typography>
      )}

      {data && (
        <Typography color="success" sx={{ mt: 2 }}>
          Tespit başarıyla eklendi!
        </Typography>
      )}
    </Box>
  );
}
