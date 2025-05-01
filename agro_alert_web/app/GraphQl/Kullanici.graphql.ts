import { gql } from "@apollo/client";

export const GET_ALL_KULLANICILAR = gql`
query {
  kullanicilar {
    id
    nickname
    isim
    soyisim
    sehir
    ilce
    tam_adres
    tel_no
    profil_foto_base64
    eposta
    role
    created_at
    updated_at
    cihaz_kullanici {
      id
      created_at
      cihazlar {
        id
        isim
      }
    }
  }
}
`;

export const CREATE_KULLANICI = gql`
mutation CreateUser($input: KullaniciCreateDTO!) {
  kullaniciOlustur(kullaniciData: $input) {
    id
    nickname
    isim
    soyisim
    sehir
    ilce
    tam_adres
    tel_no
    profil_foto_base64
    eposta
    role
    created_at
    updated_at
  }
}
`;

export const UPDATE_KULLANICI = gql`
mutation UpdateUser($userId: Float!, $updateUserData: KullaniciUpdateDTO!) {
  kullaniciGuncelle(kullaniciId: $userId, kullaniciGuncelleData: $updateUserData) {
    id
    nickname
    isim
    soyisim
    sehir
    ilce
    tam_adres
    tel_no
    profil_foto_base64
    eposta
    role
    created_at
    updated_at
  }
}
`;

export const GET_KULLANICI_BY_ID = gql`
query getUserById($id: Float!) {
  kullaniciBul(id: $id) {
    id
    nickname
    isim
    soyisim
    sehir
    ilce
    tam_adres
    tel_no
    profil_foto_base64
    eposta
    role
    created_at
    updated_at
    cihaz_kullanici {
      id
      created_at
      cihazlar {
        id
        isim
      }
    }
  }
}
`;