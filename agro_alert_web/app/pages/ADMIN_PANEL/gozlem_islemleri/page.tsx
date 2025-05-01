"use client"
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import GozlemBilgi from './gozlem_bilgi/page';
import GozlemEkle from './gozlem_ekle/page';
import GozlemKullaniciIdListele from './gozlem_Kullanici_id_Listele/page';
import GozlemListele from './gozlem_listele/page';




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

export default function GozlemIslemleriTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Gozlemler Tablosu" {...a11yProps(0)} />
          <Tab label="Gozlem Ekle" {...a11yProps(1)} />
          <Tab label="Gozlem İlişki Tablosu" {...a11yProps(2)} />
          <Tab label="Gozlem Bilgileri" {...a11yProps(3)} />


        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <GozlemListele />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <GozlemEkle />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <GozlemKullaniciIdListele />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <GozlemBilgi />
      </CustomTabPanel>

    </Box>
  );
}
