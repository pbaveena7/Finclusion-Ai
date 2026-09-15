import urllib.request
try:
    print(urllib.request.urlopen('http://localhost:8000/health').read())
except Exception as e:
    print(e)
