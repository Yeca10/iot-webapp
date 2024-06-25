const express = require('express');
const { Client } = require('azure-iot-device');
const { Mqtt } = require('azure-iot-device-mqtt');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const deviceConnectionString = 'HostName=IOT-CONEXION1.azure-devices.net;DeviceId=Dispositivo1;SharedAccessKey=02JkGxAC/KCQnECyoXKTngvvPPDjDh40gAIoTD6RJEs=';

const client = Client.fromConnectionString(deviceConnectionString, Mqtt);

client.open((err) => {
  if (err) {
    console.error('Error al conectar al IoT Hub', err.message);
  } else {
    console.log('Conectado al IoT Hub');

    client.on('message', (msg) => {
      console.log('Mensaje recibido del IoT Hub:', msg.data.toString());
      io.emit('newData', msg.data.toString());
      client.complete(msg, (err) => {
        if (err) {
          console.error('Error al confirmar el mensaje', err.message);
        }
      });
    });
  }
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

