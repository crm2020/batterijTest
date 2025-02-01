from time import sleep
from umqtt.simple import MQTTClient
from machine import ADC, Pin
import dht

SERVER = '192.168.1.112'  # MQTT Server Address (Change to the IP address of your Pi)
CLIENT_ID = 'ESP32_DHT11_Sensor'
TOPIC = b'temp_humidity'

def connect_mqtt(client):
    """Connect to the MQTT broker."""
    try:
        client.connect()
        print("Connected to MQTT broker")
    except Exception as e:
        print(f"MQTT connection failed: {e}")
        raise

client = MQTTClient(CLIENT_ID, SERVER)
connect_mqtt(client)  # Connect to the MQTT broker

# Sensor initialization
try:
    sensor = dht.DHT11(Pin(26))
except Exception as e:
    print(f"Failed to initialize DHT11 sensor: {e}")

rain = ADC(Pin(35))
rain.atten(ADC.ATTN_11DB)

class LDR:
    """This class reads a value from a light-dependent resistor (LDR)."""

    def __init__(self, pin, min_value=0, max_value=100):
        """
        Initializes a new instance.
        :parameter pin: A pin that's connected to an LDR.
        :parameter min_value: Minimum value that can be returned by the value() method.
        :parameter max_value: Maximum value that can be returned by the value() method.
        """
        if min_value >= max_value:
            raise ValueError('Min value must be less than max value')

        # Initialize ADC (analog to digital conversion)
        self.adc = ADC(Pin(pin))

        # Set 11dB input attenuation (voltage range roughly 0.0v - 3.6v)
        self.adc.atten(ADC.ATTN_11DB)

        self.min_value = min_value
        self.max_value = max_value

    def read(self):
        """
        Read a raw value from the LDR.
        :return: A value from 0 to 4095.
        """
        return self.adc.read()

    def value(self):
        """
        Read a value from the LDR in the specified range.
        :return: A value from the specified [min, max] range.
        """
        return (self.max_value - self.min_value) * self.read() / 4095 + self.min_value

# Initialize an LDR
ldr = LDR(34)

while True:
    try:
        sensor.measure()  # Poll sensor
        t = sensor.temperature()
        h = sensor.humidity()
        R = rain.read()
        value = ldr.value()

        print("Does it rain? %3.1f mV" % R)
        print('Temperature: %3.1f °C' % t)
        print('Humidity: %3.1f %%' % h)
        print('LDR value: {:.2f}'.format(value))

        # Confirm sensor results are numeric
        msg = b'{0:3.1f},{1:3.1f},{2:3.1f},{3:.2f}'.format(R, t, h, value)
        client.publish(TOPIC, msg)  # Publish sensor data to MQTT topic
        print("Published message:", msg)

    except OSError as e:
        print(f"Failed to read sensor: {e}")

    sleep(2)