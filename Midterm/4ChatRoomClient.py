import socket
import threading

# Client configuration
HOST = '127.0.0.1'
PORT = 12345

# Create a socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((HOST, PORT))

name = input("Enter your name: ")
client_socket.send(name.encode())

available_rooms = client_socket.recv(1024).decode()
print(available_rooms)

selected_room = input(f"Enter the name of the room you want to join ({available_rooms}): ")
client_socket.send(selected_room.encode())

def receive_messages():
    while True:
        try:
            message = client_socket.recv(1024)
            if not message:
                break
            print(message.decode())
        except:
            print("An error occurred while receiving messages.")
            break

# Start a thread to receive messages
receive_thread = threading.Thread(target=receive_messages)
receive_thread.start()

# Main loop to send messages
while True:
    message = input()
    client_socket.send(message.encode())
