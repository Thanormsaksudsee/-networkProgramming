import telnetlib

host = "your_telnet_host"
port = 23  # Default telnet port

user = input("Username: ")#ใส่ipเครื่องที่จะเข้า
password = input("Password: ")

with telnetlib.Telnet(host, port) as session:
    session.read_until(b"Username: ")
    session.write(user.encode("utf-8") + b"\n")
    
    session.read_until(b"Password: ")
    session.write(password.encode("utf-8") + b"\n")
    
    session.write(b"ls\n")
    result = session.read_until(b"exit")
    
    print(result.decode("utf-8"))
