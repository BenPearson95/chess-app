import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(
    private AuthService: AuthService,
    private router: Router,
  ) {}

  // Check to see if user is actually logged in.
  canActivate(): Observable<boolean> {
    return this.AuthService.currentUser$.pipe(
      map(user => {
        if (!user) {
          return true;
        } else {
          this.router.navigate(['/landing']);
          return false;
        }
      })
    );
  }
  
}
