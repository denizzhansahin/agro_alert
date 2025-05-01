'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CIHAZ_KULLANICI_FOR_USER, ASSIGN_CIHAZ_TO_KULLANICI } from '@/app/GraphQl/CihazKullanici.graphql';
import { TextField, Box, Button, Typography } from '@mui/material';

export default function CihazKullaniciEkle() {
  const [kullaniciId, setKullaniciId] = useState('');
  const [cihazId, setCihazId] = useState('');
  const [createCihazKullaniciForUser, { loading: createLoading, error: createError, data: createData }] = useMutation(CREATE_CIHAZ_KULLANICI_FOR_USER);
  const [assignCihazToKullanici, { loading: assignLoading, error: assignError, data: assignData }] = useMutation(ASSIGN_CIHAZ_TO_KULLANICI);

  const handleCreateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createCihazKullaniciForUser({
        variables: { kullaniciId: parseInt(kullaniciId) },
      });
      alert('Cihaz Kullanıcı kaydı başarıyla eklendi!');
    } catch (err) {
      console.error('Cihaz Kullanıcı kaydı eklenirken hata oluştu:', err);
      alert('Cihaz Kullanıcı kaydı eklenemedi!');
    }
  };

  const handleAssignSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await assignCihazToKullanici({
        variables: { kullaniciId: parseInt(kullaniciId), cihazId: parseInt(cihazId) },
      });
      alert('Cihaz başarıyla kullanıcıya atandı!');
    } catch (err) {
      console.error('Cihaz atama işlemi sırasında hata oluştu:', err);
      alert('Cihaz kullanıcıya atanamadı!');
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 500, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Cihaz Kullanıcı İşlemleri
      </Typography>

      {/* Form for creating a Cihaz Kullanıcı */}
      <Box
        component="form"
        onSubmit={handleCreateSubmit}
        sx={{ flexDirection: 'column', display: 'flex', gap: 2, marginBottom: 4 }}
      >
        <Typography variant="h6">Cihaz Kullanıcı Kaydı Ekle</Typography>
        <TextField
          fullWidth
          type="number"
          value={kullaniciId}
          onChange={(e) => setKullaniciId(e.target.value)}
          label="Kullanıcı ID"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={createLoading}
          fullWidth
        >
          {createLoading ? 'Ekleniyor...' : 'Kaydı Ekle'}
        </Button>
        {createError && (
          <Typography color="error" sx={{ mt: 2 }}>
            Hata: {createError.message}
          </Typography>
        )}
        {createData && (
          <Typography color="success" sx={{ mt: 2 }}>
            Başarıyla eklendi!
          </Typography>
        )}
      </Box>

      {/* Form for assigning a device to a user */}
      <Box
        component="form"
        onSubmit={handleAssignSubmit}
        sx={{ flexDirection: 'column', display: 'flex', gap: 2 }}
      >
        <Typography variant="h6">Cihaz Kullanıcıya Ata</Typography>
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
          color="secondary"
          disabled={assignLoading}
          fullWidth
        >
          {assignLoading ? 'Atanıyor...' : 'Cihazı Ata'}
        </Button>
        {assignError && (
          <Typography color="error" sx={{ mt: 2 }}>
            Hata: {assignError.message}
          </Typography>
        )}
        {assignData && (
          <Typography color="success" sx={{ mt: 2 }}>
            Cihaz başarıyla atandı!
          </Typography>
        )}
      </Box>
    </Box>
  );
}
