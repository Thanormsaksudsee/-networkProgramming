const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const snmp = require('net-snmp');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const target = '192.168.75.50';
const community = 'public';
const numInterfaces = 8;

const session = snmp.createSession(target, community);

const getInterfaceInfo = (index) => new Promise((resolve, reject) => {
  const [interfaceOid, ifInOctetsOid, ifOutOctetsOid] = [
    `1.3.6.1.2.1.2.2.1.7.${index}`,
    `1.3.6.1.2.1.2.2.1.10.${index}`,
    `1.3.6.1.2.1.2.2.1.16.${index}`
  ];

  session.get([interfaceOid, ifInOctetsOid, ifOutOctetsOid], (error, varbinds) => {
    if (error) {
      reject(`Error querying interface ${index}: ${error}`);
    } else {
      const [status, dataInput, dataOutput] = varbinds.map(v => v.value.toString());
      resolve({ index, status: status === '1' ? 'up' : 'down', dataInput, dataOutput });
    }
  });
});

const emitInterfaceInfo = () => Promise.all(Array.from({ length: numInterfaces }, (_, i) => getInterfaceInfo(i + 1)))
  .then(infoList => io.emit('interfaceInfo', infoList))
  .catch(error => console.error(`Error querying interfaces: ${error}`));

let updateInterval = setInterval(emitInterfaceInfo, 1000);

app.get('/', (req, res) => res.sendFile(__dirname + '/Trapindex.html'));

io.on('connection', socket => {
  console.log('A user connected');
  emitInterfaceInfo();

  socket.on('disconnect', () => {
    clearInterval(updateInterval);
    console.log('A user disconnected');
    updateInterval = setInterval(emitInterfaceInfo, 1000);
  });
});

server.listen(10000, () => console.log('Server is running on port 10000'));
