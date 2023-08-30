import paramiko

host = "your_ssh_host"#ใส่ipเครื่องที่จะเข้า
port = 22  # Default SSH port
username = input("Username: ")
password = input("Password: ")

ssh_client = paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

ssh_client.connect(host, port, username, password)
stdin, stdout, stderr = ssh_client.exec_command("ls")
print(stdout.read().decode("utf-8"))

ssh_client.close()
