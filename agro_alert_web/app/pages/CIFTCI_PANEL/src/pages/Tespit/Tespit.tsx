'use client';

import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID } from '@/app/GraphQl/Gozlem.graphql';
import { GET_TESPITLER_BY_GOZLEM_ID } from '@/app/GraphQl/Tespit.graphql';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { GET_CIHAZ_KULLANICI_BY_KULLANICI_ID } from '@/app/GraphQl/CihazKullanici.graphql';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'tespit_tipi', headerName: 'Tespit Tipi', width: 150 },
  { field: 'gozlem_id', headerName: 'Gözlem ID', width: 100 },
  { field: 'guven_skoru', headerName: 'Güven Skoru', width: 150 },
  { field: 'sinirlayici_kutu_verisi', headerName: 'Sınırlayıcı Kutu Verisi', width: 200 },
  { field: 'created_at', headerName: 'Oluşturma Tarihi', width: 150 },
  { field: 'updated_at', headerName: 'Güncellenme Tarihi', width: 150 },
];

export default function Tespit() {
  const [tespitler, setTespitler] = useState<any[]>([]);

const [kullaniciId, setKullaniciId] = useState<number | null>(null);
  const [cihazKullaniciId, setCihazKullaniciId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.id) {
      setKullaniciId(storedUser.id);
      setCihazKullaniciId(storedUser.cihazKullaniciId || null);
    }
  }, []);

  const { data: cihazData, loading: cihazLoading } = useQuery(GET_CIHAZ_KULLANICI_BY_KULLANICI_ID, {
    variables: { kullaniciId },
    skip: !kullaniciId,
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.cihazKullaniciByKullaniciId?.id) {
        setCihazKullaniciId(data.cihazKullaniciByKullaniciId.id);
      }
    },
  });

  console.log('Cihaz Kullanıcı ID:', cihazKullaniciId);

  const { data: gozlemData, loading: gozlemLoading, error: gozlemError } = useQuery(GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID, {
    variables: { cihazKullaniciId: cihazKullaniciId },
    skip: !cihazKullaniciId,
    fetchPolicy: 'cache-and-network',
  });

  const [fetchTespitler] = useLazyQuery(GET_TESPITLER_BY_GOZLEM_ID);

  useEffect(() => {
    const fetchAllTespitler = async () => {
      if (gozlemData?.gozlemlerByCihazKullaniciId) {
        const allGozlemIds = gozlemData.gozlemlerByCihazKullaniciId.map((gozlem: any) => gozlem.id);

        const allTespitler = [];
        for (const gozlemId of allGozlemIds) {
          const { data } = await fetchTespitler({ variables: { gozlemId } });
          if (data?.tespitlerByGozlemId) {
            allTespitler.push(
              ...data.tespitlerByGozlemId.map((tespit: any) => ({
                ...tespit,
                gozlem_id: gozlemId,
              }))
            );
          }
        }
        setTespitler(allTespitler);
      }
    };

    fetchAllTespitler();
  }, [gozlemData, fetchTespitler]);

  if (gozlemLoading) {
    return <p>Veriler yükleniyor...</p>;
  }

  if (gozlemError) {
    return <p>Hata: {gozlemError.message}</p>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Kullanıcıya Ait Tüm Gözlemlerin Tespitleri
      </Typography>
      <Paper sx={{ height: 800, width: '100%' }}>
        <DataGrid
          rows={tespitler.map((tespit, index) => ({ id: index + 1, ...tespit }))}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}