const express = require('express');
const app = express();
const path = require('path');
const snmp = require('net-snmp');

const target = '192.168.119.50';
const community = 'public';
const session = snmp.createSession(target, community);
const interfaceInfoOid = '1.3.6.1.2.1.2.2.1.2.';
const numInterfaces = 8;

const getInterfaceInfo = (index) => {
  const interfaceOid = interfaceInfoOid + index;

  return new Promise((resolve, reject) => {
    session.get([interfaceOid], (error, varbinds) => {
      if (error) {
        reject(`Error querying interface ${index}: ${error}`);
      } else {
        const interfaceName = varbinds[0].value.toString();
        console.log(`Interface ${index}: ${interfaceName}`);
        resolve({ index, name: interfaceName });
      }
    });
  });
};

const interfaceInfoPromises = Array.from({ length: numInterfaces }, (_, index) =>
  getInterfaceInfo(index + 1)
);

// Middleware เพื่อให้ Express เปิดใช้งานไฟล์สาธารณะในโฟลเดอร์ที่เก็บโค้ด
app.use(express.static(path.join(__dirname)));

app.get('/interfaceInfo', (req, res) => {
  Promise.all(interfaceInfoPromises)
    .then(interfaceInfoList => {
      console.log('All interfaces queried successfully.');
      res.json(interfaceInfoList);
    })
    .catch(error => {
      console.error(`Error querying interfaces: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

const port = 20000; // หรือจะกำหนดพอร์ตที่คุณต้องการ
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
