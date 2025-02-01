from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

import ssl

app = FastAPI()

ssl_contect = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_contect.load_cert_chain("cert/cert.pem", keyfile="cert/key.pem")

# MySQL Configuration
MYSQL_CONFIG = {
    "host": "db",
    "user": "root",
    "password": "test",
    "database": "BatterijTest"
}

# MySQL Diagnostic Initialization
def init_mysql():
    try:
        connection = mysql.connector.connect(**MYSQL_CONFIG)
        if connection.is_connected():
            db_Info = connection.get_server_info()
            print("Connected to MySQL Server version", db_Info)
            cursor = connection.cursor()
            cursor.execute("select database();")
            record = cursor.fetchone()
            print("You're connected to database:", record)
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")
