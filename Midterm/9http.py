import requests

url = "http://your_api_url"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer your_access_token"
}

data = {
    "key1": "value1",
    "key2": "value2"
}

response = requests.post(url, json=data, headers=headers)
print("Response status:", response.status_code)
print("Response content:", response.text)
