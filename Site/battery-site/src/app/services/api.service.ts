import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import { Login } from "../models/login.model";
import {SessionService} from "./session.service";
import {EncryptionService} from "./encryption.service";
import forge from "node-forge";
import axios, {HttpStatusCode} from "axios";
import {SensorData} from "../models/sensordata.model";
import {Device} from "../models/device.model";
import {Measurements} from "../models/measurments.model";
import {User} from "../models/user.model";

declare var crypto: Crypto;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = "http://145.24.223.198:8080";
  private url: string = "http://145.24.223.198:8123/api"
  private testURL: string = "http://localhost:8009";
  //private testURL: string = "http://145.24.238.114:8001";

  constructor(private http: HttpClient, private session: SessionService) {

  }

  /**
   * Send a request with the username and password to the server to be checked. Return false if status code isn't 200
   * @param username The username that is being sent
   * @param password The password that is being sent
   */
  loginUser(username: string, password: string): Observable<boolean> {
    const httpBody = { username, password };
    const headers = { 'Content-Type': 'application/json' };

    return this.http.post<any>(`${this.testURL}/api/login`, JSON.stringify(httpBody), { headers, observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        this.session.setSession(response.body);
        return response.status === 200;
      }),
      catchError((error: HttpErrorResponse) => {
        return of(false);
      })
    );
  }

  /**
   * Gets all the present devices, active or not
   */
  getAllDevices(): Observable<Device[]> {
    return this.http.get<any>(`${this.testURL}/api/devices`).pipe(
      map((response: Device[]) => {
        return response.map(device => ({
          device_id: device.device_id,
          display_name: device.display_name,
          api_key: device.api_key,
          description: device.description,
          motor1: device.motor1,
          motor2: device.motor2,
          online: device.online,
          image: device.image,
        }))
      })
    )
  }

  /**
   * Gets all the info of a specific device
   * @param id The ID of the device
   */
  getDeviceById(id: number): Observable<Device> {
    return this.http.get<any>(`${this.testURL}/api/device/${id}`).pipe(
      map((data: Device) => {
        const device: Device = {
          device_id: data.device_id,
          display_name: data.display_name,
          api_key: data.api_key,
          description: data.description,
          motor1: data.motor1,
          motor2: data.motor2,
          online: data.online,
          image: data.image
        }
        return device;
      })
    )
  }

  /**
   * Create a new device
   * @param device Device object
   * @see device.model.ts
   */
  createNewDevice(device: Device): Observable<any> {
    const httpBody = {
      display_name: device.display_name,
      description: device.description,
      api_key: device.api_key,
      image: device.image,
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.testURL}/api/devices/create`, JSON.stringify(httpBody), {headers, observe: 'response'});
  }

  /**
   * Delete a device according to the given ID
   * @param device_id ID of the device to delete
   */
  deleteDevice(device_id: number): Observable<any> {
    return this.http.delete(`${this.testURL}/api/devices/${device_id}/delete`, {observe: "response"});
  }

  /**
   * Updates the details of a device by its id. It will override all the details.
   * @param device The new details
   */
  updateDevice(device: Device): Observable<any> {
    const httpBody = {
      display_name: device.display_name,
      description: device.description,
      api_key: device.api_key,
      motor1: device.motor1,
      motor2: device.motor2,
      image: device.image
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${this.testURL}/api/devices/${device.device_id}/update`, JSON.stringify(httpBody), { headers, observe: 'response' });
  }

  /**
   * Gets all the present measurements of each device.
   */
  getAllMeasurements(): Observable<Measurements[]> {
    return this.http.get<any>(`${this.testURL}/api/measurements`).pipe(
      map((response: Measurements[]) => {
        return response.map(measurement => ({
          measurement_id: measurement.measurement_id,
          time: measurement.time,
          device_id: measurement.device_id,
          voltage: Math.round((measurement.voltage + Number.EPSILON) * 100) / 100,
          temperature: Math.round((measurement.temperature + Number.EPSILON) * 100) / 100,
          amperage: Math.round((measurement.amperage + Number.EPSILON) * 100) / 100,
          motor1: measurement.motor1,
          motor2: measurement.motor2,
        }))
      })
    )
  }

  /**
   * Gets the measurements of a specific device
   * @param device_id ID of the device which the measurements are from
   */
  getMeasurementByID(device_id: number): Observable<Measurements[]> {
    return this.http.get<any>(`${this.testURL}/api/devices/${device_id}/measurements`).pipe(
      map((response: Measurements[]) => {
        return response.map(measurement => ({
          measurement_id: measurement.measurement_id,
          time: measurement.time,
          device_id: measurement.device_id,
          voltage: Math.round((measurement.voltage + Number.EPSILON) * 100) / 100,
          temperature: Math.round((measurement.temperature + Number.EPSILON) * 100) / 100,
          amperage: Math.round((measurement.amperage + Number.EPSILON) * 100) / 100,
          motor1: measurement.motor1,
          motor2: measurement.motor2,
        }))
      })
    )
  }

  /**
   * Retrieves all the users from the database and casts them to a User[] observable.
   * You need to subscribe to this function to access the data in the observable.
   * @see user.model.ts
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<any>(`${this.testURL}/api/users`).pipe(
      map((response: User[]) => {
        return response.map(user => ({
          user_id: user.user_id,
          username: user.username,
          admin: user.admin,
          password: user.password,
          name: user.name,
          email: user.email,
          user_token: user.user_token
        }))
      })
    );
  }

  /**
   * Send a body with the userdata to create a new user.
   * @param user The userdata
   * @see user.model.ts
   */
  createNewUser(user: User) {
    const httpBody = {
      username: user.username,
      admin: user.admin,
      password: user.password,
      name: user.name,
      email: user.email,
      token: user.user_token
    }

    return this.http.post(`${this.testURL}/api/users/create`, JSON.stringify(httpBody));
  }

  /**
   * Gets all the dummy data for testing
   * @deprecated
   */
  getDummyData(): Observable<Partial<SensorData>[]> {
    return this.http.get<any>(`${this.testURL}/api/test`).pipe(
      map((data: SensorData[]) => data.map((item: SensorData) => ({
        temperature: item.temperature,
        humidity: item.humidity,
        LDR: item.LDR,
        Rain: item.Rain,
        reading_time: item.reading_time
      })))
    );
  }
}

