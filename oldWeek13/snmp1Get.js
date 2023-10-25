const snmp = require('net-snmp');



const ciscoContactInfoOid = '1.3.6.1.2.1.1.3.0';
const target = '192.168.75.50';
const community = 'private';

const session = snmp.createSession(target, community);

const oids = [ciscoContactInfoOid];

session.get(oids, (error, varbinds) => {
    if (error) {
        console.error(error);
    } else {
        varbinds.forEach((vb) => {
            console.log(`${vb.oid} = ${vb.value}`);
        });
    }
    session.close();
});
