# REQUIREMENTS

## Proje Ozeti
- SitemapFlow, sitemap URL listelerini yonetmek icin gelistirilmis bir paneldir.
- Arayuz tek sayfa uygulamasi olarak `index.html`, `styles.css` ve `app.js` ile sunulur.
- Node.js tabanli bir Express sunucusu (`server.js`) statik dosyalari servis eder ve kalici veri saklama ile proxy islemlerini yurutur.

## Calistirma Gereksinimleri
- Node.js 18 veya uzeri (yerlesik `fetch`, `AbortController` ve `fs/promises` kullaniliyor).
- Proje dizininde `npm install` ve `npm start` calistirildiginda uygulama `http://localhost:3000` uzerinden erisilebilir.
- Sunucu calisirken `data/sitemaps.json` dosyasinin yazilabilir olmasi gerekir; yoksa uygulama varsayilan sitemap setiyle dosyayi olusturur.

## Fonksiyonel Gereksinimler
- **FR-01** Uygulama baslangicta `GET /api/sitemaps` uzerinden sitemap konfiglerini ceker; istek basarisiz olursa kodda tanimli iki varsayilan sitemap ile calisir.
- **FR-02** Her sitemap icin `/api/fetch-sitemap` uzerinden XML icerigi okunur, `urlset` ve `sitemapindex` yapilari desteklenir.
- **FR-03** Ana tablo satirlarinda baslik, tam URL, etiket listesi, toplam URL sayisi, son guncelleme ve islemler gosterilir.
- **FR-04** Kullanici yeni sitemap ekleyebilir; form yalnizca http/https URL kabul eder, yinelemeyi engeller ve basariyla eklendiginde kalici listeye kaydedilir.
- **FR-05** Basliklar satir uzerinden duzenlenebilir; kaydetme islemi arka plana PUT istegi gondererek kalici listeyi gunceller.
- **FR-06** Etiketler satir uzerinde gosterilir; kullanici etiket silebilir, mevcut etiketlerden secerek veya yeni yazarak ekleyebilir.
- **FR-07** Sitemap satiri silindiginde kalici liste guncellenir, secili detaylar temizlenir ve durum mesaji gosterilir.
- **FR-08** Arama kutusu baslik ve URL uzerinden canli filtreleme yapar; alan adi ve etiket filtreleriyle birlikte calisir.
- **FR-09** Alan adi filtre menusu, her alan adindaki toplam URL sayisini uste simge karakterleriyle gosterir; filtre secimi tabloyu buna gore daraltir.
- **FR-10** Etiket menusu mevcut tum etiketlere gore filtreler; secim yapildiginda tablo ve detay paneli senkronize olur.
- **FR-11** `Yenile` dugmesi sitemap listesini API'dan tekrar cekip tabloyu yeniden olusturur.
- **FR-12** Bir satir secildiginde sagdaki detay paneli acilir; detaylar tarih araligina gore filtrelenebilir ve kayitlar en yeniye gore siralanir.
- **FR-13** Detay paneli sitemap yuklenememis ise hata mesajlari ve bos durum metinleri gosterir.
- **FR-14** Tum islemler kullaniciya durum mesajlari (basari, hata, uygunsuz girdi) ile iletilir ve yukleme surecinde `Yukleniyor...` ifadesi kullanilir.

## API Gereksinimleri
- **GET `/api/sitemaps`**: Kalici listeden okunmus sitemap konfiglerini JSON dizi olarak dondurur; veri okunamazsa varsayilan setle cevap verir.
- **PUT `/api/sitemaps`**: Gonderilen dizi icindeki her eleman icin URL dogrular, baslik ve etiketleri temizler; hatali girdide 400 doner, basarili istekte kalici dosyayi gunceller.
- **GET `/api/fetch-sitemap`**: `url` sorgu parametresiyle verilen adresi Node fetch ile ceker, HTTP/TLS hatalarini `INSECURE_AGENT` ile tekrar deneme ve 15s zaman asimi ile yonetir, XML icerigi `Content-Type: application/xml` olarak doner.
- Tum endpointler hata durumunda anlamli HTTP kodlari ve mesajlari saglar (400, 404, 502, 504, 500).

## Veri ve Dogrulama Gereksinimleri
- Sitemap listesi `data/sitemaps.json` dosyasinda saklanir; dosya bulunamazsa dizin olusturulup varsayilan veri yazilir.
- Kaydedilen her kaydin URL'si normalize edilir, baslik bos ise URL kullanilir, etiketler tekrar ve bosluk temizliginden gecirilir.
- Etiket adlari kucuk harfe indirgenmis kontrollerle tekrar etmeyecek sekilde saklanir; tablo ve filtrelerde orijinal girisler gosterilir.
- Detay panelindeki tarih filtreleri gun bazinda calisir; baslangic bitis degerleri girilmemis ise tum kayitlar gosterilir.

## Kullanici Arayuzu Gereksinimleri
- Masaustu odakli iki sutunlu yerlesim: sol tarafta liste ve kontroller, sag tarafta secili sitemap detaylari.
- Ziyaretciye inline baglantilar saglanir (`target="_blank"`); ayrica domain bilgisi tablo satirinda alt satir olarak gosterilir.
- Hata ve bos durumlar icin tablo ve detay panelinde metin tabanli bilgilendirici satirlar bulunur.
- Iconify ikonlari ve Moment.js CDN uzerinden yuklenir; Moment icin `tr` yerel ayari kullanilir.

## Dis Bagimliliklar
- Sunucu tarafinda: `express`, `undici`.
- Istemci tarafinda: CDN uzerinden `moment-with-locales`, `iconify`.
- Yerel dosya sistemi erisimi: `data/` altinda olusturulan JSON dosyasi yazilabilir olmalidir.

## Hata Durumu ve Gunlukleme
- Sunucu yakalanmamis hatalarda 500 doner ve konsola `"Beklenmedik sunucu hatasi"` mesajini yazar.
- Sitemap proxy istegi zaman asimina ugradiginda 504, hedef erismediyse 502, DNS bulunamadiginda 404 dondurulur.
- Istemci tarafinda stderr/console uzerinden hatalar raporlanir ve arayuzde kullaniciya okunabilir mesajlar sunulur.
