import socket

def main():
    server_ip = "127.0.0.1"
    server_port = 8888
    
    server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server.bind((server_ip, server_port))
    print(f"[*] Listening on {server_ip}:{server_port}")
    
    while True:
        data, addr = server.recvfrom(1024)
        print(f"[*] Received data from {addr[0]}:{addr[1]} - {data.decode()}")
        response = b"Hello from UDP Server"
        server.sendto(response, addr)

if __name__ == "__main__":
    main()
