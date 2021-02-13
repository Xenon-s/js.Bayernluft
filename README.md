# Schnittstelle Bayernluft WLAN-Modul für ioBroker
Diese Schnittstelle ermöglicht es, Lüftungsgeräte der Firma Bayernluft (Bavariavent) in den ioBroker zu integrieren. Es ist sowhl möglich die Live-Werte auszulesen, als auch das Gerät zu steuern.

## Was sollte beachtet werden?
Um das Script nutzen zu können, muss das export-Template geändert werden. Ich habe die Vorlage hier auf github liegen.

## Wie wird das Template geändert?
1. Zuerst muss die Oberfläche des jeweiligen Gerätes per IP auferufen werden <br>
2. Im nächsten Schritt muss auf das Einstellungsrad geklickt werden <br> ![pic1.png](/admin/pic1.png) <br>
3. Runterscrollen bis zum Punkt **Experten Modus** <br> ![pic2.png](/admin/pic2.png) <br>
4. Die Datei "export.txt" löschen (am besten vorher per Klick auf **Download** sichern) <br> ![pic3.png](/admin/pic3.png) <br>
5. Die neue Datei "export.txt" auswählen und hochladen <br> ![pic4.png](/admin/pic4.png) <br>

Das Ist notwendig, damit die Daten im JSON-Format vorliegen und im ioBroker verarbeitet werden können!
    
## Script-Updates einspielen
- Das Script ist so aufgebaut, dass Updates keinen Einfluss auf eure Geräteliste haben. Ihr müsst eure Geräte nur einmal anlegen und das wars dann auch schon. Die folgende Zeile gibt euch einen Hinweis darauf, ab wo ihr das Script bei einem Update kopieren und wieder einfügen müsst. <br>
  ![update_Zeile.png](/admin/update_Zeile.png)
 <br>


# Anleitung
## Script erstellen
Ein neues JS Script in iobroker erstellen und das Script aus "script-bwm-script.js" kopieren und einfügen. <br>

![erstellung_1.png](/admin/erstellung_1.png) <br>
![erstellung_2.png](/admin/erstellung_2.png) <br>

## Geräte anlegen

Folgendes muss eingetragen werden:
1. Standardpfad: Der Pfad unter welchem das Gerät erscheinen soll
2. Ip und Port: Standardport ist die 80
3. Intervall (polling): In welchem Intervall sollen die Daten geholt werden (5-60 Sekundne möglich, eingabe allerdings in Millisekunden)

![pic5.png](/admin/pic5.png)

**Falls euch meine Arbeit gefällt :** <br>

[![Paypal Donation](https://img.shields.io/badge/paypal-donate%20%7C%20spenden-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3EYML5A4EMJCW&source=url)


## Changelog

### 0.1 (2021-02-13)
* (xenon-s) initial commit


# License
MIT License

Copyright (c) 2020 xenon-s<br>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:<br>

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.<br>

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.<br>
