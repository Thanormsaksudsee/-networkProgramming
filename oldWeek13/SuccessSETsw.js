const snmp = require('net-snmp');
const readline = require('readline');

const target = '192.168.75.50';
const community = 'private';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the port to disable : ', (portInput) => {
  const portToDisable = parseInt(portInput) ;

  rl.question('Enter the value (on = 1 | off = 2): ', (valueInput) => {
    const value = parseInt(valueInput) ;

    const session = snmp.createSession(target, community);
    const oid = `1.3.6.1.2.1.2.2.1.7.${portToDisable}`;

    const varbinds = [
      { oid, type: snmp.ObjectType.Integer, value }
    ];

    session.set(varbinds, (error, varbinds) => {
      if (error) {
        console.error(`Error disabling port ${portToDisable}: ${error}`);
      } else {
        varbinds.forEach((vb) => {
          console.log(`${vb.oid} = ${vb.value}`);
        });
        console.log(`Disabled port ${portToDisable} successfully`);
      }
      session.close();
      rl.close();
    });
  });
});
