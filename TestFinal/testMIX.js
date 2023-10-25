const snmp = require('net-snmp');
const readline = require('readline');

const target = '192.168.75.50';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const getSnmpSession = (community) => snmp.createSession(target, community);
const getSessionForDisabling = () => getSnmpSession('private');
const getSessionForInfo = () => getSnmpSession('public');

const performSnmpSet = (session, oid, type, value) => {
  const varbinds = [{ oid, type, value }];
  return new Promise((resolve, reject) => {
    session.set(varbinds, (error, varbinds) => (error ? reject(error) : resolve(varbinds)));
  });
};

const disablePort = async (portToDisable, value) => {
  const session = getSessionForDisabling();
  const oid = `1.3.6.1.2.1.2.2.1.7.${portToDisable}`;
  try {
    const varbinds = await performSnmpSet(session, oid, snmp.ObjectType.Integer, value);
    console.log(`Disabled port ${portToDisable} successfully`);
    varbinds.forEach((vb) => console.log(`${vb.oid} = ${vb.value}`));
  } catch (error) {
    console.error(`Error disabling port ${portToDisable}: ${error}`);
  } finally {
    session.close();
    rl.close();
  }
};

const getInfoForInterfaces = async () => {
  const sessionForInfo = getSessionForInfo();
  const interfaceInfoOid = '1.3.6.1.2.1.2.2.1.2.';
  const numInterfaces = 8;
  const getInterfaceInfo = (index) => {
    const interfaceOid = interfaceInfoOid + index;
    return new Promise((resolve, reject) => {
      sessionForInfo.get([interfaceOid], (error, varbinds) => {
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

  try {
    const interfaceInfoPromises = Array.from({ length: numInterfaces }, (_, index) =>
      getInterfaceInfo(index + 1)
    );
    const interfaces = await Promise.all(interfaceInfoPromises);
    console.log('All interfaces queried successfully');
    console.log('Interface Information:', interfaces);
  } catch (error) {
    console.error('Error querying interfaces:', error);
  } finally {
    sessionForInfo.close();
  }
};

rl.question('Enter the port to disable : ', (portInput) => {
  const portToDisable = parseInt(portInput);
  rl.question('Enter the value (on = 1 | off = 2): ', (valueInput) => {
    const value = parseInt(valueInput);
    disablePort(portToDisable, value);
    getInfoForInterfaces();
  });
});
