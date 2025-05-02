# agro_alert

# AgroAlert - Yapay Zeka Destekli Akıllı Tarım Takip Sistemi

AgroAlert, tarımsal verimliliği artırmak ve sürdürülebilir tarım uygulamalarını desteklemek amacıyla geliştirilmiş, yapay zeka (AI) ve sensör teknolojilerini birleştiren akıllı bir izleme sistemidir. Amacı, çiftçilere tarlalarındaki potansiyel sorunları (hastalık, zararlı, olumsuz çevre koşulları) erken aşamada tespit etme ve bilinçli kararlar alma imkanı sunmaktır.

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
*   **Veritabanı:** SQLite3 (Entegrasyon), İlişkisel Veritabanları (Bulut üzerinde).
*   **AI/ML:** Python, YOLOv11, DeepSeek R1 14B (LLM), TensorFlow/PyTorch.
*   **Bulut & DevOps:** Google Cloud Platform, Docker (Potansiyel), Git, GitHub.
*   **İşletim Sistemi (Sunucu):** Pardus 23.3.
*   **Tasarım Araçları:** TinkerCad, Proteus.

## 🚀 Kurulum ve Kullanım

(Bu bölüm projenin mevcut durumuna göre detaylandırılmalıdır. Örnek: "Detaylı kurulum adımları ve kullanım kılavuzu yakında eklenecektir." veya temel adımlar listelenebilir.)

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır ve geliştirilmesine katkıda bulunmak isteyen herkesi bekliyoruz. Lütfen 'Issues' bölümünü kullanarak hata bildirin veya 'Pull Requests' ile kod katkısı yapın.

## 📄 Lisans

Bu proje [Lisans Adı Seçin - Örn: MIT Lisansı] altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakınız. (Henüz eklenmediyse eklenmesi önerilir.)

---

## 🏆 TEKNOFEST 2025 Proje Bağlamı

Bu proje, **Space Teknopoli AgroAlert** takımı tarafından **TEKNOFEST 2025 KKTC Araştırma Proje Yarışması** kapsamında, **Tarım Kategorisi**nde "Akıllı Tarım Teknolojileri" konusu üzerine geliştirilmiştir.

*   **Takım Adı:** Space Teknopoli AgroAlert
*   **Takım ID:** 577020
*   **Başvuru ID:** 3050990

**Takım Üyeleri:**

*   **Mehmet AKINOL:** Takım Danışmanı
*   **Denizhan ŞAHİN:** Takım Kaptanı
*   **Resul Ekrem ÖZTÜRK:** Üye
*   **Abdullah DEREBAŞI:** Üye
*   **Ömer ŞARLAVUK:** Üye

(Takım üyelerinin sorumlulukları ve okulları gibi detaylar istenirse buraya eklenebilir.)

## 🙏 Teşekkürler

Projemize ilham veren ve gelişim sürecinde destek olan TEKNOFEST ve Türkiye Teknoloji Takımı Vakfı'na (T3 Vakfı) teşekkür ederiz.

---

**Tarımınızı Akıllandırın, Verimliliği Artırın!**


## Görseller :
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003812.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003818.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003823.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003830.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003835.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003840.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003847.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003852.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003906.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003946.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003951.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 003956.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 004001.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 004013.png)
![Görsel](gorseller\Ekran görüntüsü 2025-05-03 004022.png)
