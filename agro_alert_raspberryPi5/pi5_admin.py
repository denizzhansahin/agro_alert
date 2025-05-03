import requests
import json
import time # Token süresinin dolmasını simüle etmek için (isteğe bağlı)
from goruntu_tespit_hastalik import goruntu_tespit_hastalik
from goruntu_tespit_bocek import goruntu_tespit_bocek

# --- Yapılandırma ---
LOGIN_URL = "http://192.168.0.166:5000/auth/login" # KENDİ REST GİRİŞ ENDPOINT'İNİZ
GRAPHQL_URL = "http://192.168.0.166:5000/graphql"     # KENDİ GraphQL ENDPOINT'İNİZ
LOGIN_EMAIL = "ciftci@admin.com"              # Test kullanıcınızın e-postası
LOGIN_PASSWORD = "ciftci"               # Test kullanıcınızın şifresi

# Token'ın JSON yanıtında hangi anahtar altında olduğunu belirtin
TOKEN_KEY = "userData" # VEYA 'token', 'access_token' vb. olabilir, API'nize bakın

"""
# GraphQL Sorgusu (Örnek)
GET_PROFILE_QUERY = 
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
    sifre
    role
    created_at
    updated_at
    cihaz_kullanici {id created_at}
  }
}
"""

CREATE_GOZLEMLER_MUTATION = """

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

"""


CREATE_TESTPIT_MUTATION = """
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

"""

CREATE_UYARİ_MUTATION = """
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
"""

kullaniciId_giris_sonrasi = None

class ApiClient:
    """
    REST ile giriş yapıp, alınan token ile GraphQL istekleri atan istemci.
    Token yenileme mantığını içerir.
    """
    def __init__(self, login_url, graphql_url, email, password, token_key="accessToken"):
        self.login_url = login_url
        self.graphql_url = graphql_url
        self.email = email
        self.password = password
        self.token_key = token_key
        self.token = None
        self.session = requests.Session() # Oturum yönetimi ve varsayılan başlıklar için
        self.session.headers.update({'Content-Type': 'application/json'})

    def login(self):
        """REST endpoint'ine POST isteği göndererek oturum açar ve token'ı alır."""
        print(f"'{self.login_url}' adresine giriş isteği gönderiliyor...")
        login_payload = {
            'email': self.email,
            'password': self.password
        }
        try:
            response = self.session.post(self.login_url, json=login_payload)
            response.raise_for_status() # 4xx veya 5xx hatalarında exception fırlatır

            login_data = response.json()

            global kullaniciId_giris_sonrasi
            kullaniciId_giris_sonrasi = login_data[self.token_key]["id"] # Kullanıcı ID'sini 
            print("Kullanıcı1111111111 ID'si:", kullaniciId_giris_sonrasi)

            if self.token_key in login_data:
                self.token = login_data[self.token_key]["token"]
                # Token'ı sonraki istekler için session'ın varsayılan başlıklarına ekle
                self.session.headers.update({'Authorization': f'Bearer {self.token}'})
                print("Giriş başarılı. Token alındı ve ayarlandı.")
                print("Token (başlangıcı):", self.token)
                return True
            else:
                print(f"Giriş yanıtında '{self.token_key}' anahtarı bulunamadı. Yanıt: {login_data}")
                self.token = None
                # Başarısız giriş sonrası Authorization başlığını temizle (varsa)
                self.session.headers.pop('Authorization', None)
                return False

        except requests.exceptions.RequestException as e:
            print(f"Giriş sırasında ağ/HTTP hatası: {e}")
            # Yanıt içeriğini yazdırmak faydalı olabilir (eğer varsa)
            if hasattr(e, 'response') and e.response is not None:
                 try:
                     print(f"Hata yanıtı: {e.response.json()}")
                 except json.JSONDecodeError:
                     print(f"Hata yanıtı (text): {e.response.text}")
            self.token = None
            self.session.headers.pop('Authorization', None)
            return False
        except json.JSONDecodeError:
            print(f"Giriş yanıtı JSON olarak ayrıştırılamadı. Yanıt: {response.text}")
            self.token = None
            self.session.headers.pop('Authorization', None)
            return False

    def execute_graphql(self, query, variables=None):
        """GraphQL endpoint'ine kimlik doğrulamalı istek gönderir."""
        if not self.token:
            print("Token bulunamadı. Önce giriş yapılıyor...")
            if not self.login():
                print("Giriş başarısız. GraphQL isteği yapılamıyor.")
                return None

        graphql_payload = {'query': query}
        if variables:
            graphql_payload['variables'] = variables

        print(f"\n'{query[:30].strip()}...' GraphQL sorgusu çalıştırılıyor...")
        try:
            # Session zaten Authorization başlığını içeriyor olmalı
            response = self.session.post(self.graphql_url, json=graphql_payload)

            # Token süresi dolmuşsa veya geçersizse 401 dönebilir
            if response.status_code == 401:
                print("Token geçersiz veya süresi dolmuş (HTTP 401). Yeniden giriş deneniyor...")
                if self.login():
                    print("Yeniden giriş başarılı. GraphQL isteği tekrar deneniyor...")
                    # Session başlıkları login() içinde güncellendiği için tekrar istek gönder
                    response = self.session.post(self.graphql_url, json=graphql_payload)
                    # İkinci denemede de 401 olursa artık hata verelim
                    if response.status_code == 401:
                         print("Yeniden giriş sonrası da token hatası (401) alındı.")
                         return None
                else:
                    print("Yeniden giriş başarısız.")
                    return None

            # Diğer HTTP hatalarını kontrol et
            response.raise_for_status()

            result = response.json()

            # GraphQL seviyesindeki hataları kontrol et
            if 'errors' in result:
                print("GraphQL Hataları:")
                print(json.dumps(result['errors'], indent=2))
                # Token ile ilgili spesifik GraphQL hatası varsa burada da yakalanabilir
                # ama genellikle 401 daha yaygındır.
                return None # GraphQL hatası durumunda None dönelim

            print("GraphQL isteği başarıyla tamamlandı.")
            return result.get('data')

        except requests.exceptions.RequestException as e:
            print(f"GraphQL isteği sırasında ağ/HTTP hatası: {e}")
            if hasattr(e, 'response') and e.response is not None:
                 try:
                     print(f"Hata yanıtı: {e.response.json()}")
                 except json.JSONDecodeError:
                     print(f"Hata yanıtı (text): {e.response.text}")
            return None
        except json.JSONDecodeError:
            print(f"GraphQL yanıtı JSON olarak ayrıştırılamadı. Yanıt: {response.text}")
            return None

    

# --- Ana Çalışma Akışı ---
if __name__ == "__main__":
    # İstemciyi oluştur
    client = ApiClient(LOGIN_URL, GRAPHQL_URL, LOGIN_EMAIL, LOGIN_PASSWORD, token_key=TOKEN_KEY)
    
    # GraphQL sorgusunu çalıştır (gerekirse otomatik giriş yapacak)
    #profile_data = client.execute_graphql(GET_PROFILE_QUERY)
    bocek_veriler = goruntu_tespit_bocek()
    print("\nBöcek Verileri:")
    #print(bocek_veriler)

    # 1. Böcek gözlemlerini gönder
    if bocek_veriler: # Eğer goruntu_tespit_bocek'ten veri geldiyse
        print("\n--- Böcek Gözlemleri Sunucuya Gönderiliyor ---")
 
        # `goruntu_tespit_bocek` fonksiyonundan gelen her bir sözlük
        # zaten `CreateGozlemlerDto` formatına uygun olmalı.
        print(f"Gönderilen Gözlem Tipi: {bocek_veriler[0].get('gozlem_tipi')}, Algılanan Nesne Sayısı: {bocek_veriler[0].get('sayisal_deger')}")

        # Mutation için gerekli değişkenleri hazırla
        # Değişken adı ('createGozlemData') mutation string'indeki ile aynı olmalı
        variables_for_mutation = {
            "createGozlemData": bocek_veriler[0]
        }

        # execute_graphql fonksiyonunu mutation ve değişkenlerle çağır
        gozlem_olusturma_sonucu = client.execute_graphql(
            CREATE_GOZLEMLER_MUTATION,
            variables=variables_for_mutation
        )

        print("Kullanıcı ID'si:", kullaniciId_giris_sonrasi)

        if gozlem_olusturma_sonucu:
            print("Gözlem başarıyla oluşturuldu:")
            print("type: ", type(gozlem_olusturma_sonucu))
            print("keys: ", gozlem_olusturma_sonucu.keys())
            print("type createGozlem: ", type(gozlem_olusturma_sonucu["createGozlem"]))
            print("keys createGozlem: ", gozlem_olusturma_sonucu["createGozlem"].keys())
            print("keys createGozlem ID: ", gozlem_olusturma_sonucu["createGozlem"]["id"])
            #print(json.dumps(gozlem_olusturma_sonucu, indent=2))
            if bocek_veriler[0].get('sayisal_deger') >= 1:
                variables_for_tespit = { 
                    "createTespitData": {
                        "gozlemId": gozlem_olusturma_sonucu["createGozlem"]['id'],  # Gözlem ID'sini kullan
                        "tespit_tipi": "böcek_tespiti",
                        "guven_skoru": 0.095,  # Örnek güven skoru, gerçek değeri ile değiştirin
                        "sinirlayici_kutu_verisi": "swgwe"
                    }
                }
                tespit_sonucu = client.execute_graphql(CREATE_TESTPIT_MUTATION,variables=variables_for_tespit)
                print("güven skoru: ", variables_for_tespit["createTespitData"]["guven_skoru"])
               
                if tespit_sonucu["createTespit"]["guven_skoru"] < 0.5:
                    print("Tespit başarıyla oluşturuldu:")
                    print("type: ", type(tespit_sonucu))
                    print("keys: ", tespit_sonucu.keys())
                    print("type createTespit: ", type(tespit_sonucu["createTespit"]))
                    print("keys createTespit: ", tespit_sonucu["createTespit"].keys())
                    print("keys createTespit ID: ", tespit_sonucu["createTespit"]["id"])

                    variables_for_uyari = {
                            "createUyariData" : {
                                "kullaniciId" : kullaniciId_giris_sonrasi,
                                "tespitId" : tespit_sonucu["createTespit"]["id"],
                                "uyari_seviyesi" : "Yüksek",
                                "mesaj" : "deneme",
                                "durum" : "deneme",
                            }
                        }
                    
                    uyari_sonucu = client.execute_graphql(CREATE_UYARİ_MUTATION,variables=variables_for_uyari)
                    
        else:
            print("Gözlem oluşturulamadı veya hata oluştu.")
        print("-" * 20) # Gözlemler arasına ayırıcı koy

    else:
        print("\nGönderilecek böcek gözlemi bulunamadı.")

    hastalik_veriler = goruntu_tespit_hastalik()
    print("\nHastalık Verileri:")
    #print(hastalik_veriler)



    # 1. Böcek gözlemlerini gönder
    if hastalik_veriler: # Eğer goruntu_tespit_bocek'ten veri geldiyse
        print("\n--- Böcek Gözlemleri Sunucuya Gönderiliyor ---")
 
        # `goruntu_tespit_bocek` fonksiyonundan gelen her bir sözlük
        # zaten `CreateGozlemlerDto` formatına uygun olmalı.
        print(f"Gönderilen Gözlem Tipi: {hastalik_veriler[0].get('gozlem_tipi')}, Algılanan Nesne Sayısı: {hastalik_veriler[0].get('sayisal_deger')}")

        # Mutation için gerekli değişkenleri hazırla
        # Değişken adı ('createGozlemData') mutation string'indeki ile aynı olmalı
        variables_for_mutation = {
            "createGozlemData": hastalik_veriler[0]
        }

        # execute_graphql fonksiyonunu mutation ve değişkenlerle çağır
        gozlem_olusturma_sonucu = client.execute_graphql(
            CREATE_GOZLEMLER_MUTATION,
            variables=variables_for_mutation
        )

        if gozlem_olusturma_sonucu:
            print("Gözlem başarıyla oluşturuldu:")
            #print(json.dumps(gozlem_olusturma_sonucu, indent=2))

            print("type: ", type(gozlem_olusturma_sonucu))
            print("keys: ", gozlem_olusturma_sonucu.keys())
            print("type createGozlem: ", type(gozlem_olusturma_sonucu["createGozlem"]))
            print("keys createGozlem: ", gozlem_olusturma_sonucu["createGozlem"].keys())
            #print(json.dumps(gozlem_olusturma_sonucu, indent=2))
            if hastalik_veriler[0].get('sayisal_deger') > 1:
                variables_for_tespit = { 
                    "createTespitData": {
                        "gozlemId": gozlem_olusturma_sonucu["createGozlem"]['id'],  # Gözlem ID'sini kullan
                        "tespit_tipi": "hastalik_tespiti",
                        "guven_skoru": 0.095,  # Örnek güven skoru, gerçek değeri ile değiştirin
                        "sinirlayici_kutu_verisi": "swgwe"
                    }
                }
                tespit_sonucu = client.execute_graphql(CREATE_TESTPIT_MUTATION,variables=variables_for_tespit)
                print("güven skoru: ", variables_for_tespit["createTespitData"]["guven_skoru"])
               
                if tespit_sonucu["createTespit"]["guven_skoru"] < 0.5:
                    print("Tespit başarıyla oluşturuldu:")
                    print("type: ", type(tespit_sonucu))
                    print("keys: ", tespit_sonucu.keys())
                    print("type createTespit: ", type(tespit_sonucu["createTespit"]))
                    print("keys createTespit: ", tespit_sonucu["createTespit"].keys())
                    print("keys createTespit ID: ", tespit_sonucu["createTespit"]["id"])

                    variables_for_uyari = {
                            "createUyariData" : {
                                "kullaniciId" : kullaniciId_giris_sonrasi,
                                "tespitId" : tespit_sonucu["createTespit"]["id"],
                                "uyari_seviyesi" : "Yüksek",
                                "mesaj" : "deneme",
                                "durum" : "deneme",
                            }
                        }
                    
                    uyari_sonucu = client.execute_graphql(CREATE_UYARİ_MUTATION,variables=variables_for_uyari)

            
        else:
            print("Gözlem oluşturulamadı veya hata oluştu.")
        print("-" * 20) # Gözlemler arasına ayırıcı koy

    else:
        print("\nGönderilecek böcek gözlemi bulunamadı.")


    #burada raspberryPi'den gelen verileri alıp işleyebilirsiniz
    #sırası ile böcek verisi kontrolü
    #gozlem
    #varsa uyarı
    #sırası ile hastalık verisi kontrolü
    #gozlem
    #gozlem
    #tespit
    #varsa uyarı

    """
    if profile_data:
        print("\nProfil Bilgisi:")
        print(json.dumps(profile_data, indent=2))
    else:
        print("\nProfil bilgisi alınamadı.")

    
    # --- Token Süresinin Dolduğunu Simüle Etme (İsteğe Bağlı Test) ---
    if client.token: # Eğer ilk sorgu başarılıysa ve token varsa
        print("\n--- Token süresinin dolduğunu simüle edelim ---")
        print("Mevcut Token (başlangıcı):", client.token[:10] + "...")
        # Token'ı session başlıklarından geçersiz bir değerle değiştir
        client.session.headers.update({'Authorization': 'Bearer gecersiz_token'})
        # client.token'ı None yapmak yerine session'daki header'ı bozmak daha gerçekçi
        # client.token = None # Bu da bir yöntem ama session'daki header kalır
        print("Session'daki token geçersiz kılındı.")

        print("\nGeçersiz token ile sorgu tekrar deneniyor (yeniden giriş bekleniyor)...")
        profile_data_retry = client.execute_graphql(GET_PROFILE_QUERY)

        if profile_data_retry:
            print("\nYeniden giriş sonrası Profil Bilgisi:")
            print(json.dumps(profile_data_retry, indent=2))
            print("Yeni Token (başlangıcı):", client.token[:10] + "...")
        else:
            print("\nYeniden giriş sonrası da profil bilgisi alınamadı.")

    """