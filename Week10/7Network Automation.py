from netmiko import ConnectHandler

SW4 = {
    'device_type': 'cisco_ios',
    'ip': '192.168.255.139', 
    'username': 'cisco',
    'password': 'cisco',
}

SW5 = { 
    'device_type': 'cisco_ios',
    'ip': '192.168.255.140',
    'username': 'cisco',
    'password': 'cisco',
}

all_devices = [SW4, SW5]

for devices in all_devices:
    net_connect = ConnectHandler(**devices)
    for n in range (2,10):
        print(b'Configuring VLAN ' + str(n).encode('ascii'))
        config_commands = ['vlan '+str(n), 'name Python_VLAN_'+str(n)]
        output = net_connect.send_config_set(config_commands)
        print(output)