import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private AuthService: AuthService,
    private router: Router,
  ){ }

  // Check to see if user is authenticated and logged in..
  canActivate(): Observable<boolean> {
    return this.AuthService.currentUser$.pipe(
      map(user => {
        if (user) {
          // Allow them onto the route they're on.
          return true;
        } else {
          // Reroute them to the landing page.
          this.router.navigate(['']);
          return false;
        }
      })
    );
  }

}
