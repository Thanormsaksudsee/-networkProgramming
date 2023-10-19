const express = require('express');
const snmp = require('net-snmp');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/disablePort', (req, res) => {
  const { portToDisable, value } = req.body;

  if (!portToDisable || !value) {
    return res.status(400).json({ error: 'โปรดระบุ port และ value' });
  }

  const target = '192.168.119.50';
  const community = 'private';

  const session = snmp.createSession(target, community);

  const oid = `1.3.6.1.2.1.2.2.1.7.${portToDisable}`;
  const varbinds = [{ oid, type: snmp.ObjectType.Integer, value }];

  session.set(varbinds, (error, varbinds) => {
    if (error) {
      console.error(`เกิดข้อผิดพลาดในการปิด port ${portToDisable}: ${error}`);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการปิด port' });
    }

    varbinds.forEach((vb) => {
      console.log(`${vb.oid} = ${vb.value}`);
    });

    console.log(`ปิด port ${portToDisable} สำเร็จ`);
    session.close();
    res.json({ success: true, message: `ปิด port ${portToDisable} สำเร็จ` });
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/oldindex.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});