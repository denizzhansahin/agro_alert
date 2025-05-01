"use client"
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PageCihazlarTable from './cihaz_list/page';
import CihazEkle from './cihaz_ekle/page';
import CihazEdit from './cihaz_edit/page';
import CihazBilgi from './cihaz_bilgi/page';





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

export default function CihazlarIslemleriTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Cihazlar Tablosu" {...a11yProps(0)} />
          <Tab label="Cihaz Ekle" {...a11yProps(1)} />
          <Tab label="Cihaz Güncelleme" {...a11yProps(2)} />
          <Tab label="Cihaz Bilgi" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <PageCihazlarTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CihazEkle/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <CihazEdit/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <CihazBilgi/>
      </CustomTabPanel>
    </Box>
  );
}
