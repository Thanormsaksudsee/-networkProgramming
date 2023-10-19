
from pysnmp.entity.rfc3413.oneliner import cmdgen
import datetime



host = '192.168.255.124'
communnity = 'public'


system_name = '1.3.6.1.2.1.1.5.0'


gig0_0_in_oct = '1.3.6.1.2.1.2.2.1.10.1'
gig0_0_in_uPackets = '1.3.6.1.2.1.2.2.1.11.1'
gig0_0_out_oct = '1.3.6.1.2.1.2.2.2.1.16.1'
gig0_0_out_uPackets = '1.3.6.1.2.1.2.2.1.17.1'


def snmp_query(host, communnity, oid):
    errorIndication, errorStatus, errorIndex, varBinds = cmdgen.CommandGenerator().getCmd(
        cmdgen.CommunityData(communnity),
        cmdgen.UdpTransportTarget((host, 161)),
        oid
    )


    if errorIndication:
        print(errorIndication)
    else:
        if errorStatus:
            print('%s at %s' % (
                errorStatus.prettyPrint(),
                errorIndex and varBinds[int(errorIndex) - 1][0] or '?'
            )
        )
        else:
            for name, val in varBinds:
                return(str(val))

result = {}
result['Time'] = datetime.datetime.utcnow().isoformat()
result['hostname'] = snmp_query(host, communnity, system_name)
result['gig0_0_in_oct'] = snmp_query(host, communnity, gig0_0_in_oct)
result['gig0_0_in_uPackets'] = snmp_query(host, communnity, gig0_0_in_uPackets)
result['gig0_0_out_oct'] = snmp_query(host, communnity, gig0_0_out_oct)
result['gig0_0_out_uPackets'] = snmp_query(host, communnity, gig0_0_out_uPackets)

with open('/Git/-networkProgramming-15/result.txt', 'a') as f:
    f.write(str(result))
    f.write('\n')
