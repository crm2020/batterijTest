import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postLoginData(url: string, data: any): Observable<any> {
    console.log('Sending HTTP POST request to', url, 'with data:', data);  // Log the request details
    return this.http.post(url, data, {
      observe: 'response'  // Change this if you want to inspect the full HTTP response
    });
  }
  
}
