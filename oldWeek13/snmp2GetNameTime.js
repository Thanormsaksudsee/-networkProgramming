const snmp = require('net-snmp');

const sysNameOid = '1.3.6.1.2.1.1.5.0';
const systemUptimeOid = '1.3.6.1.2.1.1.3.0';
const target = '192.168.119.50';
const community = 'public';

const session = snmp.createSession(target, community);

const oids = [sysNameOid, systemUptimeOid];

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
