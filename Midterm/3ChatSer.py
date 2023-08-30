import socket
import threading

# Server configuration
HOST = '127.0.0.1'
PORT = 12345

# Create a socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((HOST, PORT))
server_socket.listen()

print(f"Server is listening on {HOST}:{PORT}")

# List to keep track of connected clients and their names
clients = {}

def broadcast(message):
    for client in clients:
        try:
            client.send(message)
        except:
            clients.pop(client, None)

def handle_client(client_socket, client_name):
    clients[client_socket] = client_name
    print(f"{client_name} connected")
    
    while True:
        try:
            message = client_socket.recv(1024)
            if not message:
                break
            sender_name = clients[client_socket]
            message_to_send = f"{sender_name}: {message.decode()}"
            print(message_to_send)
            broadcast(message_to_send.encode())
        except:
            clients.pop(client_socket, None)
            break

while True:
    client_socket, client_address = server_socket.accept()
    client_name = client_socket.recv(1024).decode()
    client_thread = threading.Thread(target=handle_client, args=(client_socket, client_name))
    client_thread.start()
