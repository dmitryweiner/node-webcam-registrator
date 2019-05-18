const mqtt = require('mqtt');
const mqttClient  = mqtt.connect('mqtt://test.mosquitto.org'); // TODO get url from config


const BME280 = require('bme280-sensor');
const options = {
  i2cBusNo   : 2,
  i2cAddress : 0x76,
};
const bme280 = new BME280(options);


const NodeWebcam = require('node-webcam');
const opts = {
  callbackReturn: "base64"
};
const Webcam = NodeWebcam.create(opts);

const mqttInitPromise = new Promise((resolve, reject) => {
  mqttClient.on('connect', resolve);
});

const webcamCapturePromise = new Promise((resolve, reject) => {
  NodeWebcam.capture("test_picture", opts, function (err, data) {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
});

Promise.all([
  bme280.init(),
  mqttInitPromise,

]).then(() => {
  return Promise.all([
    bme280.readSensorData(),
    webcamCapturePromise,
  ]);
}).then((results) => {
  console.log(results);
  //mqttClient.publish(topic, message, [options], [callback]);
})
.catch(error => console.warn(error));
