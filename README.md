# agro_alert

# AgroAlert - Yapay Zeka Destekli Akıllı Tarım Takip Sistemi

AgroAlert, tarımsal verimliliği artırmak ve sürdürülebilir tarım uygulamalarını desteklemek amacıyla geliştirilmiş, yapay zeka (AI) ve sensör teknolojilerini birleştiren akıllı bir izleme sistemidir. Amacı, çiftçilere tarlalarındaki potansiyel sorunları (hastalık, zararlı, olumsuz çevre koşulları) erken aşamada tespit etme ve bilinçli kararlar alma imkanı sunmaktır.

---



---

## 🧠 AgroAlert Bilgi Bankası & Detaylı Dokümantasyon (DeepWiki)

Bu projenin temel README dosyası genel bir bakış sunarken, AgroAlert'ın tüm teknik detaylarına, mimari kararlarına, araştırma notlarına ve derinlemesine bileşen analizlerine erişmek için özel olarak oluşturulmuş **DeepWiki bilgi bankamızı** ziyaret edebilirsiniz.

**➡️ [AgroAlert DeepWiki Sayfasına Git](https://deepwiki.com/denizzhansahin/agro_alert)**

**DeepWiki Üzerinde Neler Bulabilirsiniz?**

DeepWiki platformu, projenin daha yapılandırılmış ve kapsamlı bir şekilde belgelendirilmesini sağlar. Bu sitede özellikle aşağıdaki gibi konular hakkında ayrıntılı bilgilere ulaşabilirsiniz:

*   **Derinlemesine Sistem Mimarisi:**
    *   Bileşenler arası etkileşim diyagramları (Veri akışı, kontrol akışı).
    *   Bulut (Google Cloud) ve yerel (Pardus) sunucu yapılandırma detayları.
    *   Ağ protokolleri ve iletişim katmanı hakkında bilgiler.
*   **Donanım Bileşenleri:**
    *   Kullanılan sensörlerin (nem, GPS vb.) teknik özellikleri ve kalibrasyon notları.
    *   Raspberry Pi 5 kurulumu ve özelleştirmeleri.
    *   Kamera modülü seçimi ve konfigürasyonu.
    *   GSM (SIM808GSM) modülü bağlantı ve AT komutları detayları.
    *   3D baskı modellerin (koruyucu kılıf, robot şasisi vb.) tasarım süreçleri ve STL dosyalarına bağlantılar (varsa).
*   **Yazılım Bileşenleri:**
    *   **Backend (NestJS):** Modül yapısı, API endpoint'lerinin detaylı açıklamaları, GraphQL şeması, TypeORM entity ilişkileri, kimlik doğrulama (Authentication/Authorization) akışları.
    *   **Mobil Uygulama (React Native/Expo):** Ekran tasarımları, bileşen hiyerarşisi, state yönetimi detayları, API entegrasyonu.
    *   **Veritabanı:** Detaylı şema tasarımı, tablolar arası ilişkiler (ERD), veri modelleri.
*   **Yapay Zeka Modelleri:**
    *   **Görüntü İşleme (YOLOv11):** Kullanılan veri setleri, etiketleme süreci, model eğitimi (hyperparameter tuning), performans metrikleri (mAP, precision, recall), tespit ve segmentasyon sonuçlarının yorumlanması.
    *   **Doğal Dil İşleme (DeepSeek LLM):** Chatbot için yapılan fine-tuning süreci, kullanılan veri seti, prompt engineering teknikleri, modelin yetenekleri ve sınırlılıkları.
*   **Kurulum ve Dağıtım (Deployment):**
    *   Geliştirme ortamının detaylı kurulum adımları (bağımlılıklar, ortam değişkenleri).
    *   Sunucu (Backend/AI Modelleri) ve mobil uygulamanın farklı platformlara dağıtım (deployment) stratejileri ve adımları.
*   **Araştırma ve Geliştirme Notları:**
    *   Proje sürecinde karşılaşılan zorluklar ve bulunan çözümler.
    *   Teknoloji seçimlerinin gerekçeleri.
    *   Literatür taraması ve ilgili çalışmalar.
    *   Gelecek geliştirme fikirleri ve potansiyel iyileştirmeler.

Kısacası, projenin "nasıl çalıştığı", "neden bu şekilde tasarlandığı" ve "nasıl daha da geliştirilebileceği" gibi konularda derinlemesine bilgi edinmek istiyorsanız, DeepWiki sayfamız sizin için doğru adres!

**➡️ [https://deepwiki.com/denizzhansahin/agro_alert](https://deepwiki.com/denizzhansahin/agro_alert)**

---

## 📝 Sorun: Tarımda Erken Teşhisin Önemi

Geleneksel tarım yöntemlerinde, özellikle geniş arazilerde, bitki hastalıklarının (örneğin, buğdaydaki Yaprak Pası), zararlı böceklerin (örneğin, Süne) veya aşırı sulama gibi olumsuz çevresel faktörlerin zamanında fark edilmesi oldukça zordur. Bu gecikmeler;

*   Ciddi **verim kayıplarına** (%10'lardan başlayıp %90'lara varabilen),
*   Önemli **ekonomik zararlara**,
*   Ürün **kalitesinde düşüşe**,
*   Gereksiz veya yanlış zamanda yapılan **ilaçlama ve sulama** gibi uygulamalarla kaynak israfına ve çevresel etkilere yol açmaktadır.

Erken ve doğru teşhis, bu olumsuzlukları en aza indirmek için kritik öneme sahiptir.

## 🌱 Çözümümüz: AgroAlert Sistemi

AgroAlert, bu zorlukların üstesinden gelmek için entegre bir teknolojik çözüm sunar:

1.  **Akıllı Veri Toplama:** Tarlaya yerleştirilen Raspberry Pi tabanlı bir kit, kameralar aracılığıyla bitki görüntülerini ve sensörler aracılığıyla toprak nemi gibi çevresel verileri toplar. GPS modülü ile konum bilgisi de kaydedilir.
2.  **Bulut Tabanlı Analiz:** Toplanan veriler (görüntü, sensör okumaları, konum) kablosuz olarak (GSM/GPRS) bulut sunucusuna aktarılır. Burada, gelişmiş yapay zeka modelleri (özellikle YOLOv11 gibi nesne tanıma modelleri) görüntüleri analiz ederek hastalık ve zararlı belirtilerini tespit eder. Sensör verileri de olumsuz koşulları (örn. aşırı nem) belirlemek için işlenir.
3.  **Mobil Erişim ve Uyarılar:** Analiz sonuçları, kullanıcı dostu bir mobil uygulama (React Native ile geliştirilmiştir) aracılığıyla çiftçilere sunulur. Uygulama üzerinden:
    *   Tarlanın anlık durumu (tespit edilen riskler, nem seviyesi vb.) takip edilebilir.
    *   Potansiyel bir sorun algılandığında **anlık bildirimler/uyarılar** alınır.
    *   Geçmiş verilere dayalı **grafikler ve raporlar** incelenebilir.
    *   Entegre **LLM (Büyük Dil Modeli) tabanlı Chatbot** (DeepSeek R1 modeli kullanılarak) aracılığıyla tarımsal konularda sorular sorulabilir ve kişiselleştirilmiş öneriler alınabilir.
4.  **Yerli ve Açık Kaynak Odaklılık:** Sunucu tarafında yerli işletim sistemi Pardus kullanılması ve projenin açık kaynak (Open Source) felsefesiyle geliştirilmesi hedeflenmiştir.

## ✨ Temel Özellikler

*   **Yapay Zeka ile Hastalık/Zararlı Tespiti:** Görüntü işleme ile Süne, Yaprak Pası gibi yaygın sorunların erken teşhisi.
*   **Sensör Tabanlı Çevre Takibi:** Toprak nemi gibi kritik verilerin anlık izlenmesi.
*   **Anlık Uyarı Sistemi:** Tespit edilen riskler için mobil bildirimler.
*   **Konum Bazlı Veri:** Sorunların tarlanın hangi bölgesinde yoğunlaştığını görme imkanı.
*   **Kullanıcı Dostu Mobil Arayüz:** Verilere kolay erişim ve görselleştirme.
*   **Akıllı Chatbot Desteği:** LLM ile çiftçilere yönelik interaktif danışmanlık.
*   **Özelleştirilebilir ve Genişletilebilir:** Farklı sensör ve donanımlarla uyumlu yapı.

## 🛠️ Teknoloji Yığını

*   **Donanım:** Raspberry Pi 5, Kameralar, Toprak Nem Sensörleri, GPS Modülü, SIM808GSM Modülü.
*   **Backend:** NestJS, GraphQL, TypeORM, Node.js.
*   **Frontend (Mobil):** React Native, Expo, React Native Paper.
*   **(Potansiyel Web):** Next.js
*   **Veritabanı:** SQLite3 (Entegrasyon), İlişkisel Veritabanları (Bulut üzerinde).
*   **AI/ML:** Python, YOLOv11, DeepSeek R1 14B (LLM), TensorFlow/PyTorch.
*   **Bulut & DevOps:** Google Cloud Platform, Docker (Potansiyel), Git, GitHub.
*   **İşletim Sistemi (Sunucu):** Pardus 23.3.
*   **Tasarım Araçları:** TinkerCad, Proteus.

## 🚀 Kurulum ve Kullanım

Bu bölüm, projenin yerel geliştirme ortamında nasıl kurulacağına dair temel bilgileri içerir.

**Gereksinimler:**

*   [Node.js](https://nodejs.org/) (LTS sürümü önerilir)
*   [npm](https://www.npmjs.com/) veya [yarn](https://yarnpkg.com/) paket yöneticisi
*   [Git](https://git-scm.com/)

**Adımlar:**

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/denizzhansahin/agro_alert.git
    cd agro_alert
    ```

2.  **Backend Kurulumu (NestJS):**
    *   Backend kodlarının bulunduğu dizine gidin (örneğin `cd backend` veya projenin kök dizini olabilir).
    *   Gerekli bağımlılıkları yükleyin:
        ```bash
        npm install
        # veya
        yarn install
        ```
    *   Eğer varsa, ortam değişkenleri için `.env.example` dosyasını `.env` olarak kopyalayın ve kendi yapılandırmanızı (veritabanı bağlantısı, API anahtarları vb.) girin.
        ```bash
        # Örnek: cp .env.example .env
        # Sonrasında .env dosyasını düzenleyin
        ```
    *   Geliştirme sunucusunu başlatın:
        ```bash
        npm run start:dev
        # veya
        yarn start:dev
        ```
    *   Varsayılan olarak backend `http://localhost:3000` (veya NestJS projesinde belirtilen port) adresinde çalışmaya başlayacaktır.

3.  **Frontend Kurulumu (Next.js - Eğer varsa):**
    *   Frontend kodlarının bulunduğu dizine gidin (örneğin `cd frontend`).
    *   Gerekli bağımlılıkları yükleyin:
        ```bash
        npm install
        # veya
        yarn install
        ```
    *   Eğer varsa, ortam değişkenleri için `.env.local.example` dosyasını `.env.local` olarak kopyalayın ve kendi yapılandırmanızı (backend API adresi vb.) girin.
        ```bash
        # Örnek: cp .env.local.example .env.local
        # Sonrasında .env.local dosyasını düzenleyin
        ```
    *   Geliştirme sunucusunu başlatın:
        ```bash
        npm run dev
        # veya
        yarn dev
        ```
    *   Varsayılan olarak frontend `http://localhost:3001` (veya Next.js projesinde belirtilen farklı bir port) adresinde çalışmaya başlayacaktır.

4.  **Mobil Uygulama Kurulumu (React Native/Expo):**
    *   Mobil uygulama kodlarının bulunduğu dizine gidin.
    *   Kurulum ve çalıştırma adımları için o dizindeki `README.md` dosyasına (varsa) veya Expo/React Native dokümantasyonuna başvurun. Genellikle `npm install` veya `yarn install` sonrası `npx expo start` veya `yarn start` gibi komutlar kullanılır.

*Not: Yukarıdaki dizin adları (`backend`, `frontend`) varsayımsaldır. Kendi proje yapınıza göre doğru dizinlere gitmelisiniz.*

---

## 🔬 İlgili TÜBİTAK 2209-A Projesi

Bu çalışma, aynı zamanda **TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri Destekleme Programı** kapsamında desteklenen [Raspberry Pi Entegre Yapay Zekaya Dayalı Zararlı (Haşere) Tespit ve Takip Sisteminin Geliştirilmesi - 1919B012321224] no'lu proje ile de ilişkilidir. AgroAlert sisteminin geliştirilmesindeki temel araştırma ve geliştirme faaliyetlerinin bir kısmı bu destek programı çerçevesinde yürütülmüştür.

Daha fazlası için : https://github.com/denizzhansahin/tubitak-2209-2023 

**TÜBİTAK 2209-A Proje Ekibi:**

*   **Akademik Danışman:** Dr. Öğr. Üyesi Tolga Hayıt
*   **Proje Yürütücüsü (Öğrenci):** Denizhan Şahin

---

## 🏆 TEKNOFEST 2025 Proje Bağlamı

Bu proje, **Space Teknopoli AgroAlert** takımı tarafından **TEKNOFEST 2025 KKTC Araştırma Proje Yarışması** kapsamında, **Tarım Kategorisi**nde "Akıllı Tarım Teknolojileri" konusu üzerine geliştirilmiştir.

*   **Takım Adı:** Space Teknopoli AgroAlert
*   **Takım ID:** 577020
*   **Başvuru ID:** 3050990

**TEKNOFEST Takım Üyeleri:**

*   **Mehmet AKINOL:** Takım Danışmanı
*   **Denizhan ŞAHİN:** Takım Kaptanı
*   **Resul Ekrem ÖZTÜRK:** Üye
*   **Abdullah DEREBAŞI:** Üye
*   **Ömer ŞARLAVUK:** Üye

---

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır ve geliştirilmesine katkıda bulunmak isteyen herkesi bekliyoruz. Lütfen 'Issues' bölümünü kullanarak hata bildirin veya 'Pull Requests' ile kod katkısı yapın.

## 📄 Lisans

Bu proje [Lisans Adı Seçin - Örn: MIT Lisansı] altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakınız. (Henüz eklenmediyse eklenmesi önerilir.)

## 🙏 Teşekkürler

Projemizin geliştirilme sürecindeki değerli katkıları, rehberliği ve destekleri için **Dr. Öğr. Üyesi Tolga Hayıt**'a içtenlikle teşekkür ederiz.

Ayrıca, projemize ilham veren ve gelişim sürecinde destek olan **TEKNOFEST**, **Türkiye Teknoloji Takımı Vakfı (T3 Vakfı)** ve **TÜBİTAK**'a teşekkürlerimizi sunarız.

---

**Tarımınızı Akıllandırın, Verimliliği Artırın!**


## Görseller :
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003812.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003818.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003823.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003830.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003835.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003840.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003847.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003852.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003906.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003946.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003951.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20003956.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20004001.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20004013.png)
![Görsel](gorseller/Ekran%20görüntüsü%202025-05-03%20004022.png)
