const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const snmp = require('net-snmp');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const target = '192.168.119.50';
const community = 'public';

const interfaceInfoOid = '1.3.6.1.2.1.2.2.1.7.';
const ifInOctets = '1.3.6.1.2.1.2.2.1.10.';
const ifOutOctets = '1.3.6.1.2.1.2.2.1.16.'; // Assuming this is the OID for outbound octets

const numInterfaces = 8;

const session = snmp.createSession(target, community);

const getInterfaceInfo = (index) => {
  const interfaceOid = interfaceInfoOid + index;
  const ifInOctetsOid = ifInOctets + index;
  const ifOutOctetsOid = ifOutOctets + index;

  return new Promise((resolve, reject) => {
    session.get([interfaceOid, ifInOctetsOid, ifOutOctetsOid], (error, varbinds) => {
      if (error) {
        reject(`Error querying interface ${index}: ${error}`);
      } else {
        const interfaceStatus = varbinds[0].value.toString() === '1' ? 'up' : 'down';
        const dataInput = varbinds[1].value.toString();
        const dataOutput = varbinds[2].value.toString();
        const interfaceInfo = varbinds[0].value.toString(); // You may want to adjust this based on the actual information

        resolve({ index, status: interfaceStatus, dataInput, interfaceInfo, dataOutput });
      }
    });
  });
};

const emitInterfaceInfo = () => {
  const interfaceInfoPromises = Array.from({ length: numInterfaces }, (_, index) =>
    getInterfaceInfo(index + 1)
  );

  Promise.all(interfaceInfoPromises)
    .then((interfaceInfoList) => {
      console.log('All interfaces queried successfully.');
      io.emit('interfaceInfo', interfaceInfoList);
    })
    .catch((error) => {
      console.error(`Error querying interfaces: ${error}`);
    });
};

// Start the interval initially
let updateInterval = setInterval(emitInterfaceInfo, 1000);

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Trapindex.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send initial interface info when a user connects
  emitInterfaceInfo();

  // Clear the existing interval and start a new one every 10 seconds
  socket.on('disconnect', () => {
    clearInterval(updateInterval);
    console.log('A user disconnected');
    updateInterval = setInterval(emitInterfaceInfo, 1000);
  });
});

server.listen(10000, () => {
  console.log('Server is running on port 10000');
});
