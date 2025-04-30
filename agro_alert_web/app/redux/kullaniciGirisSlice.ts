import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Kullanici {
  id: number;
  isim: string;
  soyisim: string;
  eposta: string;
  role: string;
  sehir: string;
  ilce: string;
  tam_adres: string;
  tel_no: string;
  profil_foto_base64: string;
  boy: number;
  kilo: number;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface KullaniciGirisState {
  eposta: string;
  sifre: string;
  hatirla: boolean;
  hata: string;
  yukleniyor: boolean;
  kimlik?: string;
  kullanici?: Kullanici;
}

export const girisState: KullaniciGirisState = {
  eposta: '',
  sifre: '',
  hatirla: false,
  hata: '',
  yukleniyor: false,
  kimlik: undefined,
  kullanici: undefined,
}

export const girisSlice = createSlice({
  name: 'giris',
  initialState: girisState,
  reducers: {
    setHata: (state, action: PayloadAction<string>) => {
      state.hata = action.payload;
    },
    setYukleniyor: (state, action: PayloadAction<boolean>) => {
      state.yukleniyor = action.payload;
    },
    setGiris: (state, action: PayloadAction<{ eposta: string; sifre: string }>) => {
      state.eposta = action.payload.eposta;
      state.sifre = action.payload.sifre;
    },
    setKullanici: (state, action: PayloadAction<Kullanici>) => {
      state.kullanici = action.payload;
    },
  },
})

export const { setGiris, setYukleniyor, setHata, setKullanici } = girisSlice.actions

export default girisSlice.reducer