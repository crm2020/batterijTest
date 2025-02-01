import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {SessionService} from "./services/session.service";

const debug: boolean = false;

export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  if(debug) {
    return true;
  }
  const router = new Router();
  const isAuthenticated = inject(SessionService).isLoggedIn();
  if(isAuthenticated) {
    return true;
  } else {
    router.navigate(['/login']).then(r => console.log("Not authenticated"));
    return false;
  }
};

export const authGuardAdmin: CanActivateFn = (route:ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  if(debug) {
    return true;
  }
  const router = new Router();
  return inject(SessionService).isAdmin();

}
