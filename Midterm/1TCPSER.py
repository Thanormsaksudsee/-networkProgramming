import socket

HOST = '127.0.0.1'
PORT = 10001

server_socket = socket.socket()
server_socket.bind((HOST, PORT))
server_socket.listen()

print(f"Listening on {HOST}:{PORT}")

while True:
    client_socket, _ = server_socket.accept()
    print("Connected by", client_socket.getpeername())
    data = client_socket.recv(1024)
    if data:
        print("Received:", data.decode())
        client_socket.sendall(data)
    client_socket.close()
