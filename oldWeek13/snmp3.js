const snmp = require('net-snmp');
const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

const host = '192.168.232.50';
const community = 'public';

const systemNameOid = '1.3.6.1.2.1.1.5.0';
const gig0_0InOctOid = '1.3.6.1.2.1.2.2.1.10.1';
const gig0_0InUPacketsOid = '1.3.6.1.2.1.2.2.1.11.1';
const gig0_0OutOctOid = '1.3.6.1.2.1.2.2.2.1.16.1';
const gig0_0OutUPacketsOid = '1.3.6.1.2.1.2.2.1.17.1';

function snmpQuery(host, community, oid) {
    return new Promise((resolve, reject) => {
        const session = snmp.createSession(host, community);

        session.get([oid], (error, varbinds) => {
            if (error) {
                reject(error);
            } else {
                resolve(varbinds[0].value.toString());
            }
            session.close();
        });
    });
}

async function main() {
    const result = {};
    result['Time'] = new Date().toISOString();
    result['hostname'] = await snmpQuery(host, community, systemNameOid);
    result['gig0_0_in_oct'] = await snmpQuery(host, community, gig0_0InOctOid);
    result['gig0_0_in_uPackets'] = await snmpQuery(host, community, gig0_0InUPacketsOid);
    result['gig0_0_out_oct'] = await snmpQuery(host, community, gig0_0OutOctOid);
    result['gig0_0_out_uPackets'] = await snmpQuery(host, community, gig0_0OutUPacketsOid);

    try {
        await writeFileAsync('/Git/-networkProgramming-15/result.txt', JSON.stringify(result) + '\n', { flag: 'a' });
        console.log('Result written to file');
    } catch (error) {
        console.error('Error writing to file:', error);
    }
}

main();
