import paramiko

hostname = '192.168.232.131'
username = "bigkuma"
passwd = "123456"
port = 22

try: 
    p = paramiko.Transport((hostname, port))
    p.connect(username=username, password=passwd)
    print("[*] Connected to " + hostname + " via SSH")
    sftp = paramiko.SFTPClient.from_transport(p)
    print("[*] Starting file download")
    sftp.get("/home/bigkuma/bigkuma/test.txt","/Users/KMUTNB/Desktop/d.txt")
    print("[*] File downloaded complete")
    print("[*] Starting file upload")
    sftp.put("/Users/KMUTNB/Desktop/d.txt","/home/bigkuma/bigkuma/u.txt")
    print("[*] File upload complete")
    p.close()
    print("[*] Disconnected from ")

except Exception as err:
    print("[!] "+str(err))