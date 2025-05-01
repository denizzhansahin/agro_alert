"use client"
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@mui/material';
import { CREATE_CIHAZ } from '@/app/GraphQl/Cihazlar.graphql';



export default function CihazEkle() {
  const [cihazData, setCihazData] = useState({
    cihaz_seri_no: "",
    isim: "",
    durum: "",
    konum_enlem: "",
    konum_boylam: "",
  });

  const [createCihaz, { loading, error, data }] = useMutation(CREATE_CIHAZ);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createCihaz({
        variables: {
          input: {
            cihaz_seri_no: cihazData.cihaz_seri_no,
            isim: cihazData.isim,
            durum: cihazData.durum,
            konum_enlem: cihazData.konum_enlem ? parseFloat(cihazData.konum_enlem) : null,
            konum_boylam: cihazData.konum_boylam ? parseFloat(cihazData.konum_boylam) : null,
          },
        },
      });
      alert("Cihaz başarıyla eklendi!");
      setCihazData({
        cihaz_seri_no: "",
        isim: "",
        durum: "",
        konum_enlem: "",
        konum_boylam: "",
      });
    } catch (err) {
      console.error("Cihaz eklenirken hata oluştu:", err);
      alert("Cihaz eklenemedi!");
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
        value={cihazData.cihaz_seri_no}
        onChange={(e) => setCihazData({ ...cihazData, cihaz_seri_no: e.target.value })}
        helperText="Cihaz seri numarasını girin."
        label="Cihaz Seri No"
        required
      />
      <TextField
        fullWidth
        value={cihazData.isim}
        onChange={(e) => setCihazData({ ...cihazData, isim: e.target.value })}
        helperText="Cihaz ismini girin."
        label="Cihaz İsmi"
        required
      />
      <TextField
        fullWidth
        value={cihazData.durum}
        onChange={(e) => setCihazData({ ...cihazData, durum: e.target.value })}
        helperText="Cihaz durumunu girin."
        label="Cihaz Durumu"
        required
      />
      <TextField
        fullWidth
        value={cihazData.konum_enlem}
        onChange={(e) => setCihazData({ ...cihazData, konum_enlem: e.target.value })}
        helperText="Cihazın konum enlemini girin (opsiyonel)."
        label="Konum Enlem"
      />
      <TextField
        fullWidth
        value={cihazData.konum_boylam}
        onChange={(e) => setCihazData({ ...cihazData, konum_boylam: e.target.value })}
        helperText="Cihazın konum boylamını girin (opsiyonel)."
        label="Konum Boylam"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Ekleniyor..." : "Cihaz Ekle"}
      </Button>
      {error && <p style={{ color: "red" }}>Hata: {error.message}</p>}
      {data && <p style={{ color: "green" }}>Cihaz başarıyla eklendi!</p>}
    </Box>
  );
}
