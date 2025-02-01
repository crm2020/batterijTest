import { Injectable } from '@angular/core';
import { Users } from "../dummy-data";
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private loggedIn = false;

  constructor() { }

  login(username: string, password: string): boolean {
    let user = Users.find(user => user.username === username);
    this.loggedIn = user?.password === password;
    sessionStorage.setItem('loggedIn', `${this.loggedIn}`);
    return user?.password === password;
  }

  /**
   * Clear the session storage
   */
  logout() {
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('expires_at');
  }

  /**
   * Check if the expiresAt is still valid
   */
  isLoggedIn():boolean {
    return moment().isBefore(this.getExpiration());
  }

  /**
   * Check if the user is an administrator
   */
  isAdmin():boolean {
    //TODO: Check if the user is admin, retrieve this from the database
    return true;
  }

  /**
   * Set the token and expiresAt in the sessionStorage for authentication
   * @param authResult
   */
  setSession(authResult:any) {
    console.log("Setting Session");
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    sessionStorage.setItem('id_token', authResult.id_token);
    sessionStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  /**
   * Gets the expiresAt from the session storage
   */
  getExpiration() {
    const expiration:string = sessionStorage!.getItem('expires_at')!;
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
