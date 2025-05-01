"use client";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_CIHAZ, GET_CIHAZ_BY_ID } from '@/app/GraphQl/Cihazlar.graphql';
import { Button } from '@mui/material';

export default function CihazEdit() {
  const [cihazId, setCihazId] = useState("");
  const [cihazData, setCihazData] = useState({
    cihaz_seri_no: "",
    isim: "",
    durum: "",
    konum_enlem: "",
    konum_boylam: "",
  });

  const { refetch } = useQuery(GET_CIHAZ_BY_ID, {
    variables: { id: parseInt(cihazId) },
    skip: !cihazId,
  });

  const handleFetchData = async () => {
    if (cihazId) {
      const { data } = await refetch({ id: parseInt(cihazId) });
      setCihazData(data.getCihazById);
    }
  };

  const [updateCihaz, { loading, error, data }] = useMutation(UPDATE_CIHAZ);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateCihaz({
        variables: {
          id: parseInt(cihazId),
          input: {
            id: parseInt(cihazId), // Include the id field here
            cihaz_seri_no: cihazData.cihaz_seri_no,
            isim: cihazData.isim,
            durum: cihazData.durum,
            konum_enlem: parseFloat(cihazData.konum_enlem),
            konum_boylam: parseFloat(cihazData.konum_boylam),
          },
        },
      });
      alert("Cihaz başarıyla güncellendi!");
    } catch (err) {
      console.error("Cihaz güncellenirken hata oluştu:", err);
      alert("Cihaz güncellenemedi!");
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
            value={cihazId}
            onChange={(e) => setCihazId(e.target.value)}
            helperText="Güncellenecek cihazın ID'sini girin."
            label="Cihaz ID"
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
            Cihaz Verisi Getir
          </Button>
        </Box>
        <TextField
          fullWidth
          value={cihazData.cihaz_seri_no}
          onChange={(e) => setCihazData({ ...cihazData, cihaz_seri_no: e.target.value })}
          helperText="Cihaz seri numarasını girin."
          label="Cihaz Seri No"
        />
        <TextField
          fullWidth
          value={cihazData.isim}
          onChange={(e) => setCihazData({ ...cihazData, isim: e.target.value })}
          helperText="Cihaz ismini girin."
          label="Cihaz İsmi"
        />
        <TextField
          fullWidth
          value={cihazData.durum}
          onChange={(e) => setCihazData({ ...cihazData, durum: e.target.value })}
          helperText="Cihaz durumunu girin."
          label="Cihaz Durumu"
        />
        <TextField
          fullWidth
          value={cihazData.konum_enlem}
          onChange={(e) => setCihazData({ ...cihazData, konum_enlem: e.target.value })}
          helperText="Cihazın konum enlemini girin."
          label="Konum Enlem"
        />
        <TextField
          fullWidth
          value={cihazData.konum_boylam}
          onChange={(e) => setCihazData({ ...cihazData, konum_boylam: e.target.value })}
          helperText="Cihazın konum boylamını girin."
          label="Konum Boylam"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Güncelleniyor..." : "Güncelle"}
        </Button>

        {error && <p style={{ color: "red" }}>Hata: {error.message}</p>}
        {data && <p style={{ color: "green" }}>Cihaz başarıyla güncellendi!</p>}
      </Box>
    </>
  );
}
