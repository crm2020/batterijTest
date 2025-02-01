import network

def connect_to_wifi(ssid, password, max_retries=10):
    """Connects to a Wi-Fi network.

    Args:
        ssid (str): The SSID of the Wi-Fi network.
        password (str): The password for the Wi-Fi network.
        max_retries (int): Maximum number of retries to connect. Default is 10.

    Returns:
        bool: True if connected successfully, False otherwise.
    """
    station = network.WLAN(network.STA_IF)

    if station.isconnected():
        print("Already connected")
        print("IP configuration:", station.ifconfig())
        return True

    station.active(True)
    station.connect(ssid, password)

    retries = 0
    while not station.isconnected() and retries < max_retries:
        print(f"Attempting to connect... ({retries + 1}/{max_retries})")
        retries += 1
        sleep(1)

    if station.isconnected():
        print("Connection successful")
        print("IP configuration:", station.ifconfig())
        return True
    else:
        print("Failed to connect after maximum retries")
        return False