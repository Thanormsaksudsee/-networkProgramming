import socket

HOST = '127.0.0.1'
PORT = 10002
MESSAGE = "Hello, server!"

client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
client_socket.sendto(MESSAGE.encode(), (HOST, PORT))
data, _ = client_socket.recvfrom(1024)
print("Received:", data.decode())
