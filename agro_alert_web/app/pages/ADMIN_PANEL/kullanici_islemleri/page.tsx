"use client"
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PageKullaniciTable from './kullanici_liste/page';
import KullaniciEkle from './kullanici_ekle/page';
import KullaniciEdit from './kullanici_edit/page';
import KullaniciBilgi from './kullanici_bilgi/page';


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

export default function KullaniciIslemleriTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Kullanıcı Tablosu" {...a11yProps(0)} />
          <Tab label="Kullanıcı Ekle" {...a11yProps(1)} />
          <Tab label="Kullanıcı Güncelleme" {...a11yProps(2)} />
          <Tab label="Kullanıcı Bilgi" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <PageKullaniciTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <KullaniciEkle/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <KullaniciEdit/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <KullaniciBilgi/>
      </CustomTabPanel>
    </Box>
  );
}
