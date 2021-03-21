import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { UserLogin } from '../_models/user/user-login';
import { UserSignup } from '../_models/user/user-signup';
import { map } from 'rxjs/operators';
import { AuthUser } from '../_models/user/auth-user';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiPath = environment.apiPath;
  authRoute = 'auth-user/';
  private currentUserSource = new BehaviorSubject<AuthUser>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  loginUser(userLogin: UserLogin) {
    return this.http.post(this.apiPath + this.authRoute + 'login', userLogin).pipe(
      map((response: any) => {
        const user: any = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.router.navigate(['dashboard']);
          return response;
        }
      })
    );
  }

  setCurrentUser(user: AuthUser) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
    this.router.navigate(['']);
  }

  signupUser(userSignup: UserSignup) {
    return this.http.post(this.apiPath + this.authRoute + 'signup', userSignup);
  }

}
