import telnetlib
from flask import Flask, request, render_template
import threading

app = Flask(__name__)

def telnet_to_device(ip, username, password, vlans, results):
    try:
        tn = telnetlib.Telnet(ip)
        tn.read_until(b'Username: ')
        tn.write(username.encode('ascii') + b'\n')

        if password:
            tn.read_until(b'Password: ')
            tn.write(password.encode('ascii') + b'\n')

        tn.write(b'conf t \n')

        for vlan in vlans:
            tn.write(b'vlan ' + str(vlan).encode('ascii') + b'\n')
            tn.write(b'name ROOM_' + str(vlan).encode('ascii') + b'\n')

        tn.write(b'end \n')
        tn.write(b'exit \n')

        result = tn.read_all().decode('ascii')
        tn.close()
        results[ip] = result
    except Exception as e:
        results[ip] = str(e)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        ip_vlan_pairs = request.form.get('ip_vlan_pairs').split('\n')

        results = {}
        threads = []

        for pair in ip_vlan_pairs:
            pair = pair.strip()
            if pair:
                ip, vlans = pair.split('-')
                ip = ip.strip()
                vlans = [int(vlan.strip()) for vlan in vlans.split(',')]
                thread = threading.Thread(target=telnet_to_device, args=(ip, username, password, vlans, results))
                thread.start()
                threads.append(thread)

        for thread in threads:
            thread.join()

        return render_template('result.html', results=results)

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)