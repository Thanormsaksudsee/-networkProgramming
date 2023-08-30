import socket

def main():
    target_ip = "127.0.0.1"
    target_port = 8888
    
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((target_ip, target_port))
    
    message = b"Hello from TCP Client"
    client.send(message)
    response = client.recv(4096)
    print(response.decode())
    
if __name__ == "__main__":
    main()
