import socket

HOST = '127.0.0.1'
PORT = 10002

server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server_socket.bind((HOST, PORT))

print(f"Listening on {HOST}:{PORT}")

while True:
    data, addr = server_socket.recvfrom(1024)
    print(f"Received from {addr}: {data.decode()}")
    server_socket.sendto(data, addr)
