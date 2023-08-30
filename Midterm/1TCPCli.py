import socket

HOST = '127.0.0.1'
PORT = 10001
MESSAGE = "Hello, server!"

client_socket = socket.socket()
client_socket.connect((HOST, PORT))
client_socket.sendall(MESSAGE.encode())
data = client_socket.recv(1024)
print("Received:", data.decode())
client_socket.close()
