import socket

# กำหนดข้อมูลของ client
SERVER_HOST = '127.0.0.1'  # IP Address ของเซิร์ฟเวอร์
SERVER_PORT = 12345       # Port ที่ใช้สำหรับการเชื่อมต่อ
MESSAGE = "Hello, server!" # ข้อความที่จะส่ง

# สร้าง socket object
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# เชื่อมต่อกับเซิร์ฟเวอร์
client_socket.connect((SERVER_HOST, SERVER_PORT))

# ส่งข้อมูลไปยังเซิร์ฟเวอร์
client_socket.sendall(MESSAGE.encode('utf-8'))

# รอรับข้อมูลที่ส่งกลับมาจากเซิร์ฟเวอร์
data = client_socket.recv(1024)
print(f"Received: {data.decode('utf-8')}")

# ปิดการเชื่อมต่อ
client_socket.close()
