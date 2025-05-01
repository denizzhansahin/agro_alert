import { gql } from "@apollo/client";

export const GET_UYARI_BY_ID = gql`
query getUyariById($id: Int!) {
  uyariById(id: $id) {
    id
    uyari_seviyesi
    mesaj
    durum
    created_at
    updated_at
    tespit {
      id
      tespit_tipi
      guven_skoru
    }
  }
}
`;

export const GET_UYARILAR_BY_KULLANICI_ID = gql`
query getUyarilarByKullaniciId($kullaniciId: Int!) {
  uyarilarByKullaniciId(kullaniciId: $kullaniciId) {
    id
    uyari_seviyesi
    mesaj
    durum
    created_at
    updated_at
    tespit {
      id
      tespit_tipi
      guven_skoru
    }
  }
}
`;

export const GET_UYARI_BY_TESPIT_ID = gql`
query getUyariByTespitId($tespitId: Int!) {
  uyariByTespitId(tespitId: $tespitId) {
    id
    uyari_seviyesi
    mesaj
    durum
    created_at
    updated_at
    tespit {
      id
      tespit_tipi
      guven_skoru
    }
  }
}
`;

export const CREATE_UYARI = gql`
mutation createUyari($createUyariData: CreateUyarilarDto!) {
  createUyari(createUyariData: $createUyariData) {
    id
    uyari_seviyesi
    mesaj
    durum
    created_at
    updated_at
  }
}
`;

