import socket
import threading

def handle_client(client_socket):
    request = client_socket.recv(1024)
    response = b"Hello from TCP Server"
    client_socket.send(response)
    client_socket.close()

def main():
    server_ip = "127.0.0.1"
    server_port = 8888
    
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((server_ip, server_port))
    server.listen(5)
    print(f"[*] Listening on {server_ip}:{server_port}")
    
    while True:
        client, addr = server.accept()
        print(f"[*] Accepted connection from {addr[0]}:{addr[1]}")
        client_handler = threading.Thread(target=handle_client, args=(client,))
        client_handler.start()

if __name__ == "__main__":
    main()
