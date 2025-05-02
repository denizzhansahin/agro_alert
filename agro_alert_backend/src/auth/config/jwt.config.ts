// jwt.config.ts (Erişim token'ı için olan)
import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export default registerAs("jwt", (): JwtModuleOptions => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN; // Değeri al

    // ----> BU LOGLARI EKLEYİN <----
    console.log(`[jwt.config] JWT_SECRET okundu mu?: ${!!secret}`);
    console.log(`[jwt.config] JWT_EXPIRES_IN env değeri: ${expiresIn}`);
    // ----> LOGLARIN SONU <----

    if (!secret) {
        console.error("HATA: JWT_SECRET ortam değişkeni bulunamadı!");
        // Opsiyonel: Burada bir hata fırlatabilir veya varsayılan kullanabilirsiniz
    }
    if (!expiresIn) {
        console.warn("UYARI: JWT_EXPIRES_IN ortam değişkeni bulunamadı! Varsayılan bir değer kullanılmayacak veya kütüphane varsayılanı geçerli olacak.");
         // Belki burada varsayılan atamak istersiniz? örn: expiresIn = '1h';
    }

    return {
        secret: secret || 'ACIL_DURUM_SECRET', // Çalışmaya devam etmek için bir fallback
        signOptions: {
            expiresIn: expiresIn, // Değeri doğrudan kullan
        },
    };
});