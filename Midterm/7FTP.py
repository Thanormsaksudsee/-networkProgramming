from ftplib import FTP

host = "your_ftp_host" #ใส่ipเครื่องที่จะเข้า
username = input("Username: ")
password = input("Password: ")

with FTP(host) as ftp:
    ftp.login(username, password)
    ftp.cwd("/")
    
    files = ftp.nlst()
    print("Files in root directory:")
    for file in files:
        print(file)
