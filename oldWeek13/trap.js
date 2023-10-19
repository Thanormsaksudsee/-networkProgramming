const snmp = require('net-snmp');

const target = '192.168.232.50';
const community = 'public';

const session = snmp.createSession(target, community);

const interfaceInfoOid = '1.3.6.1.2.1.2.2.1.7.';
const numInterfaces = 8;

const getInterfaceInfo = (index) => {
  const interfaceOid = interfaceInfoOid + index;

  return new Promise((resolve, reject) => {
    session.get([interfaceOid], (error, varbinds) => {
      if (error) {
        reject(`Error querying interface ${index}: ${error}`);
      } else {
        const interfaceName = varbinds[0].value.toString();
        if (interfaceName === '1') {
          console.log(`Interface ${index}: ${'up'}`);
          resolve({ index, name: interfaceName });
        } else if (interfaceName === '2') {
          console.log(`Interface ${index}: ${'down'}`);
          resolve({ index, name: interfaceName });
        }
      }
    });
  });
};

const interfaceInfoPromises = Array.from({ length: numInterfaces }, (_, index) =>
  getInterfaceInfo(index + 1)
);

Promise.all(interfaceInfoPromises)
  .then((interfaceInfoList) => {
    console.log('All interfaces queried successfully.');
  })
  .catch((error) => {
    console.error(`Error querying interfaces: ${error}`);
  })
  .finally(() => {
    session.close();
  });
