import paramiko
import threading
import os.path
import subprocess
import time
import sys
import re

def ip_is_valid():
    check = False
    global ip_list

    while True:
        print('\n # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n')
        ip_file = input("# Enter IP file name and extension: ")
        print('\n # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n')

        try:
            selected_ip_file = open(ip_file, 'r')
            selected_ip_file.seek(0)
            ip_list = selected_ip_file.readlines()
            selected_ip_file.close()
        except FileNotFoundError as e:
            print('* Found Python Traceback Cause: --->', e)
            print('\n*** File %s does not exist! Please check and try again!\n' % ip_file)

        try:
            for ip in ip_list:
                a = ip.rstrip().split('.')
                if (len(a) == 4) and (1 <= int(a[0]) <= 223) and (int(a[0]) != 127) and (int(a[0]) != 169 or int(a[1]) != 254) and (0 <= int(a[1]) <= 255 and 0 <= int(a[2]) <= 255 and 0 <= int(a[3]) <= 255):
                    print('The current IP address to verify: ', a)
                    check = True
                    continue
                else:
                    print('The current IP address to verify: ', a)
                    print('\n* There was an INVALID IP address! Please check and try again!\n')
                    check = False
                    break
        except NameError:
            continue

        if check == False:
            print('Go to While loop\n')
            continue
        elif check == True:
            print('\nAll IP addresses in "ip.txt" file are valid')
            break

        print('\n* Checking IP reachability. Please wait...\n')
        check2 = False

        while True:
            for ip in ip_list:
                ping_reply = subprocess.call(['ping','-n','-c','2','-w','1',ip])

                if ping_reply == 0:
                    check2 = True
                    continue
                elif ping_reply == 2:
                    print('\n* No response from device %s.' %ip)
                    check2 = False
                    break
                else:
                    print('\n* Ping to the following device has FAILED:',ip)
                    check2 = False
                    break

            if check2 == False:
                print('* Please re-check IP address list or device.\n')
                ip_is_valid()
            elif check2 == True:
                print('\n* All devices are reachable. Waiting for username/password file...\n')
                break

def user_is_valid():
    global user_file

    while True:
        print('# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n')
        user_file = input('# Enter user/pass file name and extension: ')
        print('\n # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #')

        if os.path.isfile(user_file) == True:
            print('\n* Username/password file has been validated. Waiting for command file...\n')
            break
        else:
            print('\n* File %s does not exist! Please check and try again!\n' % user_file)
            continue

def cmd_is_valid():
    global cmd_file

    while True:
        print('\n # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n')
        cmd_file = input('# Enter command file name and extension: ')
        print('\n # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #\n')

        if os.path.isfile(cmd_file) == True:
            print('\n* Sending command(s) to device(s)...\n')
            break
        else:
            print('\n* File %s does not exist! Please check and try again!\n' % cmd_file)
            continue

try:
    ip_is_valid()
except KeyboardInterrupt:
    print('\n\n* Program aborted by user. Exiting...\n')
    sys.exit()

try:
    user_is_valid()
except KeyboardInterrupt:
    print('\n\n* Program aborted by user. Exiting...\n')
    sys.exit()

try:
    cmd_is_valid()
except KeyboardInterrupt:
    print('\n\n* Program aborted by user. Exiting...\n')
    sys.exit()

def open_ssh_conn(ip):
    try:
        selected_user_file = open(user_file,'r')
        selected_user_file.seek(0)
        username = selected_user_file.readlines()[0].split(',')[0]
        selected_user_file.seek(0)
        password = selected_user_file.readlines()[0].split(',')[1].rstrip("\n")
        session = paramiko.SSHClient()
        session.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        session.connect(str(ip), username=username, password=password, allow_agent=False, look_for_keys=False)
        connection = session.invoke_shell()
        selected_cmd_file = open(cmd_file,'r')
        selected_cmd_file.seek(0)
        for each_line in selected_cmd_file.readlines():
            connection.send(each_line + '\n')
            time.sleep(2)
        selected_user_file.close()
        selected_cmd_file.close()
        router_output = connection.recv(65535)
        if re.search(r"% Invalid input detected at", str(router_output, 'utf-8')):
            print('* There was at least one IOS syntax error on device %s' % ip)
        else:
            print('\nDONE for device %s' % ip)
        print(str(router_output, 'utf-8') + '\n')
        session.close()
    except paramiko.AuthenticationException:
        print('* Invalid username or password. \n* Please check the username/password file or the device configuration!')
        print('* Closing program...\n')

def create_threads():
    threads = []
    for ip in ip_list:
        ip = ip.rsplit()
        th = threading.Thread(target=open_ssh_conn, args=(ip,))
        th.start()
        threads.append(th)

    for th in threads:
        th.join()

create_threads()
