import sys
import datetime
from ExpanderPi import ADC, DAC 
import board   
import busio
import adafruit_ina260

# Sensor Initialization
try:
    adc = ADC()
    i2c = busio.I2C(board.SCL, board.SDA)
    ina260 = adafruit_ina260.INA260(i2c)
except Exception as e:
    sys.exit(f"Failed to initialize sensors: {e}")

# Read sensor data
def read_sensors():
    try:
        Bat1 = adc.read_adc_voltage(7, 0)
        Tbat = adc.read_adc_voltage(8, 0)
        volt = ina260._raw_voltage * 0.00125
        curr = ina260._raw_current * 1.25
        power = ina260._raw_power * 10
        humidity = mqttclient2.humidity
        temperature = mqttclient2.temperature
        light = mqttclient2.light
        rain = mqttclient2.rain

        return {
            "timestamp": datetime.datetime.now(),
            "temperature": temperature,
            "humidity": humidity, 
            "LDR": light,
            "Rain": rain,
            "Vbat": Bat1,
            "Tbat": Tbat,
            "Currentpanel": curr,
            "Voltpanel": volt,
            "Powerpanel": power
        }
    except Exception as e:
        raise RuntimeError(f"Failed to read sensors: {e}")

# API details
api_url = "http://84.26.56.134:8007/post_sensor_data"

# Data payload
request_payload = {
    "temperature": temp_out,
    "humidity": humidity_out,
    "LDR": daylight,
    "Rain": rain,
    "Vbat": Bat1,
    "Tbat": Tbat,
    "Currentpanel": curr,
    "Voltpanel": volt,
    "Powerpanel": power
}

# Send data to API
try:
    response = requests.post(api_url, json=request_payload)
    response.raise_for_status()  # Raise exception for HTTP errors
    print(f"Response Code: {response.status_code}")
    print(f"Response: {response.text}")
except requests.exceptions.RequestException as e:
    print(f"Error sending data: {e}")