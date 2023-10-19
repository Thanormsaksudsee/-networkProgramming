const snmp = require('net-snmp');

// const systemUpTimeOid = '1.3.6.1.2.1.3.0';

const ciscoContactInfoOid = '1.3.6.1.4.1.9.2.1.61.0';
const target = '192.168.232.50';
const community = 'public';

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
