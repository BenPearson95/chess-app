import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { UserLogin } from '../_models/user/user-login';
import { UserSignup } from '../_models/user/user-signup';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiPath = environment.apiPath
  route = 'user/'

  constructor(
    private http: HttpClient,
  ) { }

  loginUser(userLogin: UserLogin) {
    return this.http.post(this.apiPath + this.route + 'login', userLogin);
  }

  signupUser(userSignup: UserSignup) {
    return this.http.post(this.apiPath + this.route + 'signup', userSignup);
  }

}
