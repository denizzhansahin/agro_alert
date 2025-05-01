import { gql } from "@apollo/client";

export const GET_ALL_CIHAZ_KULLANICILAR = gql`
query {
  allCihazKullanicilar {
    id
    created_at
    updated_at
    kullanici {
      id
      isim
      soyisim
      eposta
    }
    cihazlar {
      id
      cihaz_seri_no
      isim
      durum
    }
  }
}
`;

export const GET_CIHAZ_KULLANICI_BY_ID = gql`
query getCihazKullaniciById($id: Int!) {
  cihazKullaniciById(id: $id) {
    id
    created_at
    updated_at
    kullanici {
      id
      isim
      soyisim
      eposta
    }
    cihazlar {
      id
      cihaz_seri_no
      isim
      durum
    }
  }
}
`;

export const GET_CIHAZ_KULLANICI_BY_KULLANICI_ID = gql`
query getCihazKullaniciByKullaniciId($kullaniciId: Int!) {
  cihazKullaniciByKullaniciId(kullaniciId: $kullaniciId) {
    id
    created_at
    updated_at
    kullanici {
      id
      isim
      soyisim
      eposta
    }
    cihazlar {
      id
      cihaz_seri_no
      isim
      durum
    }
  }
}
`;

export const CREATE_CIHAZ_KULLANICI_FOR_USER = gql`
mutation createCihazKullaniciForUser($kullaniciId: Int!) {
  createCihazKullaniciForUser(kullaniciId: $kullaniciId) {
    id
    created_at
    updated_at
    kullanici {
      id
      isim
      soyisim
      eposta
    }
    cihazlar {
      id
      cihaz_seri_no
      isim
      durum
    }
  }
}
`;

export const ASSIGN_CIHAZ_TO_KULLANICI = gql`
mutation assignCihazToKullanici($kullaniciId: Int!, $cihazId: Int!) {
  assignCihazToKullanici(kullaniciId: $kullaniciId, cihazId: $cihazId) {
    id
    created_at
    updated_at
    kullanici {
      id
      isim
      soyisim
      eposta
    }
    cihazlar {
      id
      cihaz_seri_no
      isim
      durum
    }
  }
}
`;

export const REMOVE_CIHAZ_FROM_KULLANICI = gql`
mutation removeCihazFromKullanici($kullaniciId: Int!, $cihazId: Int!) {
  removeCihazFromKullanici(kullaniciId: $kullaniciId, cihazId: $cihazId)
}
`;
