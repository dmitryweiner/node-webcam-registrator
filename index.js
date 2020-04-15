const config = require('./config');
const MQTT = require('async-mqtt');
const mqttClient = MQTT.connect(config.mqtt.host, {username: config.mqtt.user, password: config.mqtt.password});

const BME280 = require('bme280-sensor');
const options = {
  i2cBusNo   : 2,
  i2cAddress : 0x76,
};
const bme280 = new BME280(options);


const NodeWebcam = require('node-webcam');
const opts = {
  callbackReturn: "base64",
  skip: 30
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
  // init things here
  bme280.init(),
  mqttInitPromise,
]).then(() => {
  return Promise.all([
    //do main work here
    bme280.readSensorData(),
    webcamCapturePromise,
  ]);
}).then((results) => {
  /**
   * results = [{ temperature_C: 23.22,
    humidity: 33.051875329622405,
    pressure_hPa: 997.6586114131737 },
   'data:image/jpeg;base64,...']
   */
  const message = {parameters: [
    {
      type: 'temperature',
      value: results[0].temperature_C,
    },
    {
      type: 'humidity',
      value: results[0].humidity,
    },
    {
      type: 'pressure',
      value: results[0].pressure_hPa,
    },
    {
      type: 'image',
      value: results[1],
    },
  ]};
  return mqttClient.publish(`sensors/${config.sensorName}`, JSON.stringify(message))
    .then(() => mqttClient.end());
})
.catch(error => console.warn(error)).then(() => process.exit(0));
