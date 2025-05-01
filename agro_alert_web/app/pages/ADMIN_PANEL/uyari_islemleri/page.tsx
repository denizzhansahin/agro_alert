"use client"
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UyarilarByKullaniciListe from './uyaribyKullaniciListe/page';
import UyariBilgi from './uyari_bilgi/page';
import UyariOlustur from './uyariOlustur/page';
import UyariByTespitId from './uyaribyTespitİd/page';




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

export default function UyariIslemleriTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Uyarı İlişkisi Tablosu" {...a11yProps(0)} />
          <Tab label="Uyarı Bilgi" {...a11yProps(1)} />
          <Tab label="Uyarı Tespit Bilgi" {...a11yProps(2)} />

          <Tab label="Uyarı Oluştur" {...a11yProps(3)} />

        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UyarilarByKullaniciListe/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UyariBilgi/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <UyariByTespitId/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <UyariOlustur/>
      </CustomTabPanel>
      

    </Box>
  );
}
