import { gql } from "@apollo/client";

export const GET_ALL_CIHAZLAR = gql`
query {
  getAllCihazlar {
    id
    cihaz_seri_no
    isim
    durum
    konum_enlem
    konum_boylam
    son_gorulme
    created_at
    updated_at
    cihaz_kullanici {
      id
      kullanici {
        id
        isim
        soyisim
      }
    }
  }
}
`;

export const GET_CIHAZ_BY_ID = gql`
query getCihazById($id: Int!) {
  getCihazById(id: $id) {
    id
    cihaz_seri_no
    isim
    durum
    konum_enlem
    konum_boylam
    son_gorulme
    created_at
    updated_at
    cihaz_kullanici {
      id
      kullanici {
        id
        isim
        soyisim
      }
    }
  }
}
`;

export const CREATE_CIHAZ = gql`
mutation CreateCihaz($input: CreateCihazDto!) {
  createCihaz(createCihazDto: $input) {
    id
    cihaz_seri_no
    isim
    durum
    konum_enlem
    konum_boylam
    created_at
    updated_at
  }
}
`;

export const UPDATE_CIHAZ = gql`
mutation UpdateCihaz($id: Int!, $input: UpdateCihazDto!) {
  updateCihaz(id: $id, updateCihazDto: $input) {
    id
    cihaz_seri_no
    isim
    durum
    konum_enlem
    konum_boylam
    created_at
    updated_at
  }
}
`;