import { gql } from "@apollo/client";

export const GET_TESPITLER_BY_GOZLEM_ID = gql`
query getTespitlerByGozlemId($gozlemId: Int!) {
  tespitlerByGozlemId(gozlemId: $gozlemId) {
    id
    tespit_tipi
    guven_skoru
    sinirlayici_kutu_verisi
    created_at
    updated_at
  }
}
`;

export const GET_TESPIT_BY_ID = gql`
query getTespitById($id: Int!) {
  tespitById(id: $id) {
    id
    tespit_tipi
    guven_skoru
    sinirlayici_kutu_verisi
    created_at
    updated_at
    gozlem {
      id
      gozlem_tipi
      sayisal_deger
      metin_deger
    }
  }
}
`;

export const CREATE_TESPIT = gql`
mutation createTespit($createTespitData: CreateTespitlerDto!) {
  createTespit(createTespitData: $createTespitData) {
    id
    tespit_tipi
    guven_skoru
    sinirlayici_kutu_verisi
    created_at
    updated_at
  }
}
`;
