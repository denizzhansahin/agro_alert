"use client"
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CihazKullaniciListesi from './cihazlar_kullanici_list/page';
import CihazKullaniciCihazKaldir from './cihaz_kullanici_cihaz_kaldir/page';
import CihazKullaniciBilgi from './cihazlar_kullanici_bilgi/page';
import CihazKullaniciEkle from './cihazlar_kullanici_ekle/page';
import CihazKullaniciListeKullaniciById from './cihazlar_kullanici_liste_kullanici_by_id/page';



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function CihazKullaniciIslemleriTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Cihaz Kullanici Tablosu" {...a11yProps(0)} />
          <Tab label="Cihaz Kullanici Ekle" {...a11yProps(1)} />
          <Tab label="Cihaz Kullanici Bilgi" {...a11yProps(2)} />
          <Tab label="Cihaz Kullanici İlişki Tablosu" {...a11yProps(3)} />
          <Tab label="Cihaz Kullanici İlişki Kaldır" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CihazKullaniciListesi />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CihazKullaniciEkle />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <CihazKullaniciBilgi />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <CihazKullaniciListeKullaniciById />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <CihazKullaniciCihazKaldir />
      </CustomTabPanel>

    </Box>
  );
}
