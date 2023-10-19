

from pysnmp.entity.rfc3413.oneliner import cmdgen

cmdGen = cmdgen.CommandGenerator()

sys_name = "1.3.3.1.2.1.1.5.0"
system_uptime = '1.3.6.1.2.1.1.3.0'

errorIndication, errorStatus, errorIndex, varBinds = cmdGen.getCmd(
    cmdgen.CommunityData('public'),
    cmdgen.UdpTransportTarget(('192.168.255.124', 161)),
    sys_name,
    system_uptime
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
            print('%s = %s' % (name.prettyPrint(), val.prettyPrint()))
            

