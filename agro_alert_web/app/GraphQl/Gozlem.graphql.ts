import { gql } from "@apollo/client";

export const GET_ALL_GOZLEMLER = gql`
query {
  allGozlemler {
    id
    gozlem_tipi
    sayisal_deger
    metin_deger
    resim_base64
    gps_enlem
    gps_boylam
    created_at
    updated_at
    cihaz_kullanici {
      id
      kullanici {
        id
        isim
        soyisim
        eposta
      }
      cihazlar {
        id
        isim
      }
    }
  }
}
`;

export const GET_GOZLEM_BY_ID = gql`
query getGozlemById($id: Int!) {
  gozlemById(id: $id) {
    id
    gozlem_tipi
    sayisal_deger
    metin_deger
    resim_base64
    gps_enlem
    gps_boylam
    created_at
    updated_at
    cihaz_kullanici {
      id
      kullanici {
        id
        isim
        soyisim
        eposta
      }
      cihazlar {
        id
        isim
      }
    }
  }
}
`;

export const GET_GOZLEMLER_BY_CIHAZ_KULLANICI_ID = gql`
query getGozlemlerByCihazKullaniciId($cihazKullaniciId: Int!) {
  gozlemlerByCihazKullaniciId(cihazKullaniciId: $cihazKullaniciId) {
    id
    gozlem_tipi
    sayisal_deger
    metin_deger
    resim_base64
    gps_enlem
    gps_boylam
    created_at
    updated_at
  }
}
`;
/*
export const GET_GOZLEMLER_BY_KULLANICI_ID = gql`
query getGozlemlerByKullaniciId($kullaniciId: Int!) {
  gozlemlerByKullaniciId(kullaniciId: $kullaniciId) {
    id
    gozlem_tipi
    sayisal_deger
    metin_deger
    resim_base64
    gps_enlem
    gps_boylam
    created_at
    updated_at
    cihaz_kullanici {
      kullanici {
        isim
        soyisim
        eposta
      }
      cihazlar {
        isim
      }
    }
  }
}
`;
*/

export const CREATE_GOZLEM = gql`
mutation createGozlem($createGozlemData: CreateGozlemlerDto!) {
  createGozlem(createGozlemData: $createGozlemData) {
    id
    gozlem_tipi
    sayisal_deger
    metin_deger
    resim_base64
    gps_enlem
    gps_boylam
    created_at
    updated_at
  }
}
`;
