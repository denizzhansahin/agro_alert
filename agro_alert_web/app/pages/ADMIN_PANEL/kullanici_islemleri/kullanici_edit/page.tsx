"use client";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_KULLANICI, GET_KULLANICI_BY_ID } from '@/app/GraphQl/Kullanici.graphql';
import { Button } from '@mui/material';

export default function KullaniciEdit() {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({
    nickname: "",
    isim: "",
    soyisim: "",
    sehir: "",
    ilce: "",
    tam_adres: "",
    tel_no: "",
    profil_foto_base64: "",
    eposta: "",
    sifre: "",
    role: ""
  });

  const { refetch } = useQuery(GET_KULLANICI_BY_ID, {
    variables: { id: parseFloat(userId) },
    skip: !userId,
  });

  const handleFetchData = async () => {
    if (userId) {
      const { data } = await refetch({ id: parseFloat(userId) });
      setUserData(data.kullaniciBul);
    }
  };

  const [updateUser, { loading, error, data }] = useMutation(UPDATE_KULLANICI);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateUser({
        variables: {
          userId: parseFloat(userId),
          updateUserData: {
            nickname: userData.nickname,
            isim: userData.isim,
            soyisim: userData.soyisim,
            sehir: userData.sehir,
            ilce: userData.ilce,
            tam_adres: userData.tam_adres,
            tel_no: userData.tel_no,
            profil_foto_base64: userData.profil_foto_base64,
            eposta: userData.eposta,
            sifre: userData.sifre,
            role: userData.role,
          },
        },
      });
      alert("Kullanıcı başarıyla güncellendi!");
    } catch (err) {
      console.error("Kullanıcı güncellenirken hata oluştu:", err);
      alert("Kullanıcı güncellenemedi!");
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleUpdate}
        sx={{
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: 3,
        }}
      >
        <Box
          sx={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            helperText="Güncellenecek kullanıcının ID'sini girin."
            label="Kullanıcı ID"
            required
            sx={{ flex: 3 }}
          />
          <Button
            fullWidth
            sx={{ height: "100%", fontSize: "1.25rem", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}
            variant="contained"
            color="secondary"
            onClick={handleFetchData}
          >
            Kullanıcı Verisi Getir
          </Button>
        </Box>
        <TextField
          fullWidth
          value={userData.nickname}
          onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
          helperText="Kullanıcı adınızı belirleyin."
          label="Kullanıcı Adı (Nick Name)"
        />
        <TextField
          fullWidth
          value={userData.isim}
          onChange={(e) => setUserData({ ...userData, isim: e.target.value })}
          helperText="İsminizi girin."
          label="İsim"
        />
        <TextField
          fullWidth
          value={userData.soyisim}
          onChange={(e) => setUserData({ ...userData, soyisim: e.target.value })}
          helperText="Soyisminizi girin."
          label="Soyisim"
        />
        <TextField
          fullWidth
          value={userData.sehir}
          onChange={(e) => setUserData({ ...userData, sehir: e.target.value })}
          helperText="Şehrinizi girin."
          label="Şehir"
        />
        <TextField
          fullWidth
          value={userData.ilce}
          onChange={(e) => setUserData({ ...userData, ilce: e.target.value })}
          helperText="İlçenizi girin."
          label="İlçe"
        />
        <TextField
          fullWidth
          value={userData.tam_adres}
          onChange={(e) => setUserData({ ...userData, tam_adres: e.target.value })}
          helperText="Tam adresinizi girin."
          label="Tam Adres"
        />
        <TextField
          fullWidth
          value={userData.tel_no}
          onChange={(e) => setUserData({ ...userData, tel_no: e.target.value })}
          helperText="Telefon numaranızı girin."
          label="Telefon No"
        />
        <TextField
          fullWidth
          value={userData.profil_foto_base64}
          onChange={(e) => setUserData({ ...userData, profil_foto_base64: e.target.value })}
          helperText="Profil fotoğrafınızı base64 formatında girin."
          label="Profil Fotoğrafı (Base64)"
        />
        <TextField
          fullWidth
          value={userData.eposta}
          onChange={(e) => setUserData({ ...userData, eposta: e.target.value })}
          helperText="E-posta adresinizi girin."
          label="E-posta"
        />
        <TextField
          fullWidth
          type="password"
          value={userData.sifre}
          onChange={(e) => setUserData({ ...userData, sifre: e.target.value })}
          helperText="Şifre oluşturun (Güçlü ve size özel olsun)."
          label="Şifre"
        />
        <FormControl fullWidth>
          <InputLabel id="role-label">Kullanıcı Rolü</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            value={userData.role}
            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="HASTA">HASTA</MenuItem>
            <MenuItem value="HEKİM">HEKİM</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Güncelleniyor..." : "Güncelle"}
        </Button>

        {error && <p style={{ color: "red" }}>Hata: {error.message}</p>}
        {data && <p style={{ color: "green" }}>Kullanıcı başarıyla güncellendi!</p>}
      </Box>
    </>
  );
}
