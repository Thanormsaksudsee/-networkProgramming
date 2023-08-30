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

# Dictionary to keep track of connected clients and their names
clients = {}

# Dictionary to keep track of clients and their chat rooms
client_rooms = {}

def broadcast(message, room):
    for client in client_rooms[room]:
        try:
            client.send(message)
        except:
            clients.pop(client, None)
            client_rooms[room].remove(client)

def handle_client(client_socket, client_name):
    clients[client_socket] = client_name
    print(f"{client_name} connected")
    
    # Send available chat rooms to client
    available_rooms = ', '.join(client_rooms.keys())
    client_socket.send(f"Available rooms: {available_rooms}".encode())
    
    # Receive selected room from client
    selected_room = client_socket.recv(1024).decode()
    if selected_room not in client_rooms:
        client_socket.send("Invalid room selected.".encode())
        client_socket.close()
        return
    
    # Add client to selected room
    client_rooms[selected_room].append(client_socket)
    broadcast(f"{client_name} joined the room.".encode(), selected_room)
    
    while True:
        try:
            message = client_socket.recv(1024)
            if not message:
                break
            sender_name = clients[client_socket]
            room = selected_room
            message_to_send = f"{sender_name}: {message.decode()}"
            print(f"{room}: {message_to_send}")
            broadcast(message_to_send.encode(), room)
        except:
            clients.pop(client_socket, None)
            client_rooms[selected_room].remove(client_socket)
            broadcast(f"{client_name} left the room.".encode(), selected_room)
            break

# Define initial chat rooms
client_rooms = {
    "general": [],
    "fun": [],
    "work": []
}

while True:
    client_socket, client_address = server_socket.accept()
    client_name = client_socket.recv(1024).decode()
    client_socket.send("Welcome to the chat server! Please select a chat room:".encode())
    client_thread = threading.Thread(target=handle_client, args=(client_socket, client_name))
    client_thread.start()
