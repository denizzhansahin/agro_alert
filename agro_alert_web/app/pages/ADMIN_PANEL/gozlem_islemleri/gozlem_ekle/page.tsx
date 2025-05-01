'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_GOZLEM } from '@/app/GraphQl/Gozlem.graphql';
import { TextField, Box, Button, Typography } from '@mui/material';

export default function GozlemEkle() {
  const [formData, setFormData] = useState({
    cihazId: '',
    gozlem_tipi: '',
    sayisal_deger: '',
    metin_deger: '',
    resim_base64: '',
    gps_enlem: '',
    gps_boylam: '',
  });

  const [createGozlem, { loading, error, data }] = useMutation(CREATE_GOZLEM);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createGozlem({
        variables: {
          createGozlemData: {
            cihazId: parseInt(formData.cihazId),
            gozlem_tipi: formData.gozlem_tipi,
            sayisal_deger: formData.sayisal_deger ? parseFloat(formData.sayisal_deger) : null,
            metin_deger: formData.metin_deger,
            resim_base64: formData.resim_base64,
            gps_enlem: formData.gps_enlem ? parseFloat(formData.gps_enlem) : null,
            gps_boylam: formData.gps_boylam ? parseFloat(formData.gps_boylam) : null,
          },
        },
      });
      alert('Gözlem başarıyla eklendi!');
    } catch (err) {
      console.error('Gözlem eklenirken hata oluştu:', err);
      alert('Gözlem eklenemedi!');
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
        Gözlem Ekle
      </Typography>

      <TextField
        fullWidth
        type="number"
        value={formData.cihazId}
        onChange={(e) => setFormData({ ...formData, cihazId: e.target.value })}
        label="Cihaz ID"
        required
      />

      <TextField
        fullWidth
        value={formData.gozlem_tipi}
        onChange={(e) => setFormData({ ...formData, gozlem_tipi: e.target.value })}
        label="Gözlem Tipi"
        required
      />

      <TextField
        fullWidth
        type="number"
        value={formData.sayisal_deger}
        onChange={(e) => setFormData({ ...formData, sayisal_deger: e.target.value })}
        label="Sayısal Değer"
      />

      <TextField
        fullWidth
        value={formData.metin_deger}
        onChange={(e) => setFormData({ ...formData, metin_deger: e.target.value })}
        label="Metin Değer"
      />

      <TextField
        fullWidth
        value={formData.resim_base64}
        onChange={(e) => setFormData({ ...formData, resim_base64: e.target.value })}
        label="Resim (Base64)"
      />

      <TextField
        fullWidth
        type="number"
        value={formData.gps_enlem}
        onChange={(e) => setFormData({ ...formData, gps_enlem: e.target.value })}
        label="GPS Enlem"
      />

      <TextField
        fullWidth
        type="number"
        value={formData.gps_boylam}
        onChange={(e) => setFormData({ ...formData, gps_boylam: e.target.value })}
        label="GPS Boylam"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        size="large"
      >
        {loading ? 'Ekleniyor...' : 'Gözlem Ekle'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Hata: {error.message}
        </Typography>
      )}

      {data && (
        <Typography color="success" sx={{ mt: 2 }}>
          Gözlem başarıyla eklendi!
        </Typography>
      )}
    </Box>
  );
}