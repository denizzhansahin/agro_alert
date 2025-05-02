"use client"
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_KULLANICI } from '@/app/GraphQl/Kullanici.graphql';
import { Button } from '@mui/material';

export default function KullaniciEkle() {
  const [nickname, setNickname] = useState("");
  const [isim, setIsim] = useState("");
  const [soyisim, setSoyisim] = useState("");
  const [sehir, setSehir] = useState("");
  const [ilce, setIlce] = useState("");
  const [tam_adres, setTamAdres] = useState("");
  const [tel_no, setTelNo] = useState("");
  const [profil_foto_base64, setProfilFotoBase64] = useState("");
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [role, setRole] = useState("");

  const [createUser, { loading, error, data }] = useMutation(CREATE_KULLANICI);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createUser({
        variables: {
          input: {
            nickname,
            isim,
            soyisim,
            sehir,
            ilce,
            tam_adres,
            tel_no: tel_no,
            profil_foto_base64,
            eposta,
            sifre,
            role,
          },
        },
      });
      alert("Kullanıcı başarıyla eklendi!");
    } catch (err) {
      console.error("Kullanıcı eklenirken hata oluştu:", err);
      alert("Kullanıcı eklenemedi!");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: 3,
      }}
    >
      <TextField
        fullWidth
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        helperText="Kullanıcı adınızı belirleyin."
        label="Kullanıcı Adı (Nick Name)"
        required
      />
      <TextField
        fullWidth
        value={isim}
        onChange={(e) => setIsim(e.target.value)}
        helperText="İsminizi girin."
        label="İsim"
        required
      />
      <TextField
        fullWidth
        value={soyisim}
        onChange={(e) => setSoyisim(e.target.value)}
        helperText="Soyisminizi girin."
        label="Soyisim"
        required
      />
      <TextField
        fullWidth
        value={sehir}
        onChange={(e) => setSehir(e.target.value)}
        helperText="Şehrinizi girin."
        label="Şehir"
        required
      />
      <TextField
        fullWidth
        value={ilce}
        onChange={(e) => setIlce(e.target.value)}
        helperText="İlçenizi girin."
        label="İlçe"
        required
      />
      <TextField
        fullWidth
        value={tam_adres}
        onChange={(e) => setTamAdres(e.target.value)}
        helperText="Tam adresinizi girin."
        label="Tam Adres"
        required
      />
      <TextField
        fullWidth
        value={tel_no}
        onChange={(e) => setTelNo(e.target.value)}
        helperText="Telefon numaranızı girin."
        label="Telefon No"
        required
      />
      <TextField
        fullWidth
        value={profil_foto_base64}
        onChange={(e) => setProfilFotoBase64(e.target.value)}
        helperText="Profil fotoğrafınızı base64 formatında girin."
        label="Profil Fotoğrafı (Base64)"
        required
      />
      <TextField
        fullWidth
        value={eposta}
        onChange={(e) => setEposta(e.target.value)}
        helperText="E-posta adresinizi girin."
        label="E-posta"
        required
      />
      <TextField
        fullWidth
        type="password"
        value={sifre}
        onChange={(e) => setSifre(e.target.value)}
        helperText="Şifre oluşturun (Güçlü ve size özel olsun)."
        label="Şifre"
        required
      />
      <FormControl fullWidth required>
        <InputLabel id="role-label">Kullanıcı Rolü</InputLabel>
        <Select
          labelId="role-label"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="ADMIN">ADMIN</MenuItem>
          <MenuItem value="ÇİFTÇİ">ÇİFTÇİ</MenuItem>

        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Ekleniyor..." : "Kullanıcı Ekle"}
      </Button>
      {/* Hata Mesajı */}
      {error && <p style={{ color: "red" }}>Hata: {error.message}</p>}
      {/* Başarılı Mesaj */}
      {data && <p style={{ color: "green" }}>Kullanıcı başarıyla eklendi!</p>}
    </Box>
  );
}
