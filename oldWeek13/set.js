const snmp = require('net-snmp');

const target = '192.168.232.50';
const community = 'private'; 
const oid = '1.3.6.1.2.1.2.2.1.8.1'; 
const value = 2; 

const session = snmp.createSession(target, community);

const varbinds = [
  { oid, type: snmp.ObjectType.Integer, value }
];

session.set(varbinds, (error, varbinds) => {
  if (error) {
    console.error(error);
  } else {
    varbinds.forEach((vb) => {
      console.log(`${vb.oid} = ${vb.value}`);
    });
  }
  session.close();
});
