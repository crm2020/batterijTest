-- Create Database
CREATE DATABASE IF NOT EXISTS BatterijTest;

USE BatterijTest;

-- Table for users
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username VARCHAR(255),
    admin INTEGER,
    password VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255)
);

-- Table for devices
CREATE TABLE IF NOT EXISTS devices (
    device_id INTEGER PRIMARY KEY,
    display_name VARCHAR(50),
    api_key VARCHAR(255),
    description VARCHAR(255),
    motor1 INTEGER,
    motor2 INTEGER,
    online BOOLEAN,
    image VARCHAR(20)
);

-- Table for logs
CREATE TABLE IF NOT EXISTS logs (
    time DATETIME,
    user_id INTEGER,
    message VARCHAR(255),
    ip VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table for measurements
CREATE TABLE IF NOT EXISTS measurements (
    time DATETIME,
    measurement_id INTEGER PRIMARY KEY,
    device_id INTEGER,
    voltage FLOAT,
    temperature FLOAT,
    amperage FLOAT,
    motor1 INTEGER,
    motor2 INTEGER,
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);

-- Table for password reset
CREATE TABLE IF NOT EXISTS reset_password (
    reset_id VARCHAR(11) PRIMARY KEY,
    expire DATE,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table for user permissions
CREATE TABLE IF NOT EXISTS user_permissions (
    device_id INTEGER,
    user_id INTEGER,
    permissions VARCHAR(10),
    FOREIGN KEY (device_id) REFERENCES devices(device_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (device_id, user_id)
);