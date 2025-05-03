import time
import cv2
import os
import base64
from picamera2 import Picamera2
from libcamera import controls

from ultralytics import YOLO




#veri yolu için zamana göre isimlendirme
veri_yol = ("/"+str(time.strftime('%c'))).replace(" ","-")


#veri yolu ve görüntü kaydetme sırası için yardımcı bir class, sadece veri tutacak
class Veri:
    yol = ""
    counter = 0

#Bir klasör yok ise oluşturma işlemi
if (not os.path.exists(os.getcwd() + veri_yol)):
    os.mkdir(os.getcwd() + veri_yol)

#yolo modeli yükle
model = YOLO("yolo11n-seg.pt")





    


#tahmin için gerekli fonskiyon
def goruntu_Tahmin(goruntu_yol):
    # Convert the image to Base64 format
    

    results = model([goruntu_yol])


    returns = []

    for result in results:
        boxes = result.boxes
        result.save(filename=goruntu_yol)
        with open(goruntu_yol, "rb") as image_file:
            resim_base64 = base64.b64encode(image_file.read()).decode('utf-8')
            
        # Collect data for CreateGozlemlerDto
        gozlem_data = {
            "cihazId": 1,  # Example cihazId, replace with actual value if available
            "gozlem_tipi": "hastalik_tespiti",
            "sayisal_deger": len(result.boxes.cls),  # Number of detected objects
            "metin_deger": "hastalik",  # Optional, set to None
            "resim_base64": resim_base64,  # Base64-encoded image
            "gps_enlem": 12.0,  # Optional, replace with actual GPS latitude if available
            "gps_boylam": 12.0,  # Optional, replace with actual GPS longitude if available
        }
        returns.append(gozlem_data)

    return returns



#Sürekli çalıştırma alanı
def goruntu_tespit_hastalik():

    #raspberry-camera başlatma
    picam2 = Picamera2()
    picam2.start(show_preview=False)
    #otomatik odaklama
    picam2.set_controls({"AfMode": controls.AfModeEnum.Continuous})


    #kamera dosya kaydetme
    picam2.start_and_capture_file(os.getcwd() + veri_yol + "/" +"hastalik_image{}.jpg".format(Veri.counter))
    #kamera kapatma
    picam2.close()

    #istediğin değeri yaz ve beklet
    time.sleep(5)

    #tahmin yapma
    returns = goruntu_Tahmin(os.getcwd() + veri_yol + "/" +"hastalik_image{}.jpg".format(Veri.counter))


    #yolları yazdır
    print("Veri yol")
    print(veri_yol)

    veri_yol_dosya = os.getcwd() + veri_yol + "/" + "hastalik_image{}.jpg".format(Veri.counter)
    print("veri yol dosya")
    print(veri_yol_dosya)

    """
    Veri.yol = veri_yol_dosya
    cv2.imwrite(veri_yol_dosya,frame)
    """

    Veri.counter += 1

    return returns


