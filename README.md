# node-webcam-registrator
Captures webcam images (and other telemetry, as temperature) and sends via MQTT to server

## Technologies
* Node.js
* MQTT
* I2C

## How to install
https://frank-mankel.de/kategorien/10-bananapi/80-bananapi-i2c-bus
```
apt-get install i2c-tools
i2cdetect -y 1
i2cdetect -y 2 => address
```

```
apt-get install fswebcam
```

```
npm i
```

## Live preview
