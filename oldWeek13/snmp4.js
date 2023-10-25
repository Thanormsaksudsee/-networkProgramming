const snmp = require('net-snmp');

const target = '192.168.75.50';  // แทนที่ด้วย IP ของอุปกรณ์ของคุณ
const community = 'public';  // แทนที่ด้วย SNMP community string ของคุณ
const oid = '1.3.6.1.2.1.1.1.0';  // แทนที่ด้วย OID ที่ถูกต้องสำหรับข้อมูลที่คุณต้องการ

const session = snmp.createSession(target, community);

session.get([oid], (error, varbinds) => {
  if (error) {
    console.error(error);
  } else {
    varbinds.forEach((vb) => {
      console.log(`${vb.oid} = ${vb.value}`);
    });
  }
  session.close();
});
