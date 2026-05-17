import urllib.request
import json

url = "https://pmddproject.vercel.app/api/analyze"
data = json.dumps({"text": "This is a simple test sentence for the backend."}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Response:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Error Response:", e.read().decode('utf-8'))
except Exception as e:
    print("Exception:", str(e))
