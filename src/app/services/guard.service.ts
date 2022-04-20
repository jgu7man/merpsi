import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private _router:Router ) {}
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const routeName = route.url.toString()
    const token = localStorage.getItem('token')
    
    if (!token && routeName === 'dashboard') {
      this._router.navigate(['login']);
      return false;
    } else {
      if (routeName === 'login' && token) {
        this._router.navigate(['dashboard']);
        return false;
      }
    }
    return true;
  }
}
