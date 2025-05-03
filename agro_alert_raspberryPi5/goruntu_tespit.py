import time

import cv2

import os

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

model = YOLO("yolov8n.pt")











    





#tahmin için gerekli fonskiyon

def goruntu_Tahmin(goruntu_yol):

    results = model([goruntu_yol])

    # Process results list

    for result in results:

        boxes = result.boxes

        print("\n\n\nBAŞLADI")

        print("HEPSİ BOXES")

        print(str(result.boxes))

        print("TUM BİLGİ")

        print(str(result))

        print("TİP")

        print(type(result.boxes))

        print("CLASS BİLGİSİ")

        print(result.boxes.cls)

        print("Toplam süne sayısı : "+str(len(result.boxes.cls)))

        print("CLASS ID BİLGİSİ")

        print(result.boxes.id)

        print("BİTTİ\n\n\n")

        result.save(filename=goruntu_yol)







#Sürekli çalıştırma alanı

if __name__ == "__main__":



    #raspberry-camera başlatma

    picam2 = Picamera2()

    picam2.start(show_preview=False)

    #otomatik odaklama

    picam2.set_controls({"AfMode": controls.AfModeEnum.Continuous})





    #kamera dosya kaydetme

    picam2.start_and_capture_file(os.getcwd() + veri_yol + "/" +"image{}.jpg".format(Veri.counter))

    #kamera kapatma

    picam2.close()



    #istediğin değeri yaz ve beklet

    time.sleep(5)



    #tahmin yapma

    goruntu_Tahmin(os.getcwd() + veri_yol + "/" +"image{}.jpg".format(Veri.counter))





    #yolları yazdır

    print("Veri yol")

    print(veri_yol)



    veri_yol_dosya = os.getcwd() + veri_yol + "/" + "image{}.jpg".format(Veri.counter)

    print("veri yol dosya")

    print(veri_yol_dosya)



    """

    Veri.yol = veri_yol_dosya

    cv2.imwrite(veri_yol_dosya,frame)

    """



    Veri.counter += 1





