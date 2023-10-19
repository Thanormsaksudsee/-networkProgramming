const snmp = require('net-snmp');

const target = '192.168.232.50';  
const community = 'private';  
const portToControl = 8;  

const session = snmp.createSession(target, community);

function performSNMPSet(value, successMessage, errorMessage) {
  const oid = `1.3.6.1.2.1.2.2.1.7.${portToControl}`;
  const varbinds = [{ oid, type: snmp.ObjectType.Integer, value }];

  session.set(varbinds, (error, varbinds) => {
    if (error) {
      console.error(`${errorMessage}: ${error}`);
    } else {
      varbinds.forEach((vb) => {
        console.log(`${vb.oid} = ${vb.value}`);
      });
      console.log(successMessage);
    }
    session.close();
  });
}

function disablePort() {
  performSNMPSet(1, `ปิด Port ${portToControl} สำเร็จ`, `เกิดข้อผิดพลาดในการปิด Port ${portToControl}`);
}

function enablePort() {
  performSNMPSet(2, `เปิด Port ${portToControl} สำเร็จ`, `เกิดข้อผิดพลาดในการเปิด Port ${portToControl}`);
}
