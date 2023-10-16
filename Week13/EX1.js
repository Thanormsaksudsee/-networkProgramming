const snmp = require('net-snmp');

const target = '192.168.255.135';  // แทนที่ด้วยที่อยู่ IP ของอุปกรณ์ SNMP ที่เป้าหมาย
const oid = '1.3.6.1.2.1.1.1.0';  // แทนที่ด้วย OID ที่คุณต้องการค้นหา

const session = snmp.createSession(target, 'public');

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
