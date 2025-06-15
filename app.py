import requests

url = 'https://committers.top/algeria'

data = requests.get(url)

print(data)