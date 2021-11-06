import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionGuard implements CanActivate {

  constructor(
    private autenticacionService: AuthenticationService,
    private router: Router

  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLoggedIn();
  }

  isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const isLoggedIn = this.autenticacionService.isLoggedIn();

        if (!isLoggedIn) {
          this.router.navigateByUrl('');
        }
        resolve(isLoggedIn);
      }, 1000);
    });

  }

}
