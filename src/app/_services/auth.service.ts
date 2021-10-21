import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { UserLogin } from '../_models/user/user-login';
import { UserSignup } from '../_models/user/user-signup';
import { map } from 'rxjs/operators';
import { AuthUser } from '../_models/user/auth-user';
import { BehaviorSubject, Observable } from 'rxjs';
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

  // Log the user in.
  loginUser(userLogin: UserLogin) {
    return this.http.post(this.apiPath + this.authRoute + 'login', userLogin).pipe(
      map((response: any) => {
        const user: any = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          
          return response;
        }
      })
    );
  }

  // Set the currently logged in user.
  setCurrentUser(user: AuthUser) {
    this.currentUserSource.next(user);
  }

  // Log the user out.
  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
    this.router.navigate(['']);
  }

  // Sign the user up.
  signupUser(userSignup: UserSignup) {
    return this.http.post(this.apiPath + this.authRoute + 'signup', userSignup);
  }

  getUserId() {
    let userId: string;
    this.currentUser$.subscribe(user => {
      if (user) {
        userId = user._id;
      } else {
        userId = null;
      }
    });
    return userId;
  }

  loggedIn(): Observable<boolean> {
    console.log('log in check');
    return this.currentUser$.pipe(map((authUser: AuthUser) => {
      if(authUser) {
        return true;
      } else {
        return false;
      }
    }));    
  }

}
