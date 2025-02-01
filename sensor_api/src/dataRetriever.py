from fastapi import FastAPI, Header, HTTPException
import json
import mysql.connector
from mysql.connector import Error

app = FastAPI()

# private_data = None
with open('private.json','r') as file:
    private_data = json.load(file)

# MySQL Configuration
MYSQL_CONFIG = {
    "host": "db",
    "user": private_data["db_user"],
    "password": private_data["db_password"],
    "database": private_data["database"]
}

# Function to verify API key
def verify_api_key(api_key: str = Header(...)):
    """
    Verifies the provided API key by checking if it exists in the 'devices' table of the database.

    Parameters:
        api_key (str): The API key passed in the request header.

    Returns:
        bool: True if the API key exists, otherwise raises an HTTPException.
    """
    try:
        connection = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = connection.cursor()

        # Query to check if the API key exists in DB
        sql = "SELECT device_id FROM devices WHERE api_key = %s"
        cursor.execute(sql, (api_key,))
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        # If the API key exists, goes on if not stops with an 403
        if result:
            return result
        else:
            raise HTTPException(status_code=403, detail="Invalid API key")
    except Error as e:
        # Handle database connection or query errors
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")


# Function to Insert Data into MySQL
def insert_data(data):
    """
    Inserts sensor data into the 'measurements' table.

    Parameters:
        data (dict): The sensor data to be inserted.

    Returns:
        bool: True if data is successfully inserted, False otherwise.
    """
    device_id = verify_api_key(data["api_key"])
    try:
        connection = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = connection.cursor()

        sql = """
        INSERT INTO measurements (device_id, time, Wtemperature, humidity, LDR, rain, Vbat, Tbat, currentpannel, voltpannel, powerpannel)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            device_id[0], data["timestamp"], data["Wtemperature"], data["humidity"], data["LDR"], data["Rain"],
            data["Vbat"], data["Tbat"], data["Currentpanel"], data["Voltpanel"], data["Powerpanel"]
        )

        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Error as e:
        print(f" Database Error: {e}")
        return False

# FastAPI Route to Receive and Store Sensor Data
@app.post("/post_sensor_data")
async def post_sensor_data(data: dict):
    try:
        success = insert_data(data)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to insert data into database")
        return {"status": "success", "data": data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process data: {e}")
