"use client"
import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Paper, Avatar, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setYukleniyor, setHata, setKullanici } from '@/app/redux/kullaniciGirisSlice';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    dispatch(setYukleniyor(true));
  
    try {
      const response = await fetch('http://192.168.0.166:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Giriş başarısız');
      }
  
      // Token'ları localStorage'a kaydet
      localStorage.setItem('token', data.userData.token);
      localStorage.setItem('refreshToken', data.userData.refreshToken);

      console.log("Kullanıcı bilgileri", data.reqUser);
      
      // Kullanıcı bilgilerini Redux'a kaydet
      dispatch(setKullanici(data.reqUser.user));
      localStorage.setItem('user', JSON.stringify(data.reqUser.user));

      // Yönlendirme yap
      if (localStorage.getItem('token') === data.userData.token) {
        if (data.reqUser.role === 'ADMIN') {
          router.push('/pages/ADMIN_PANEL/');
        } else if (data.reqUser.role === 'ÇİFTÇİ') {
          router.push('/pages/CIFTCI_PANEL/src/');
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Bir hata oluştu');
        dispatch(setHata(err.message || 'Bir hata oluştu'));
      } else {
        setError('Bir hata oluştu');
        dispatch(setHata('Bir hata oluştu'));
      }
    } finally {
      dispatch(setYukleniyor(false));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Kullanıcı Girişi
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Giriş Yap
            </Button>
            <Grid container>
              <Grid item xs>
                <Button href="#" variant="text" size="small">
                  Şifrenizi mi unuttunuz?
                </Button>
              </Grid>
              <Grid item>
                <Button href="#" variant="text" size="small">
                  {"Hesabınız yok mu? Kayıt Ol"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;