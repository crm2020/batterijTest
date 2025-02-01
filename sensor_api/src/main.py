print('RUN : main.py')
import ConnectWifi
import json
from time import sleep


# Read SSID and password for wifi from private.json
try:
    with open('private.json','r') as file:
        private_data = json.load(file)

    if not ConnectWifi.connect_to_wifi(private_data["wifi_ssid"], private_data["wifi_password"]):
        print("Wi-Fi connection failed. Exiting.")
        exit()
except Exception as e:
    print(e)

sleep(5)

import combined2