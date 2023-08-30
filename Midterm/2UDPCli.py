import socket

def main():
    target_ip = "127.0.0.1"
    target_port = 8888
    
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    message = b"Hello from UDP Client"
    client.sendto(message, (target_ip, target_port))
    response, server_addr = client.recvfrom(4096)
    print(response.decode())
    
if __name__ == "__main__":
    main()
