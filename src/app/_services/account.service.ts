import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  apiPath = environment.apiPath;
  userRoute = 'user/';
  options = {
    headers: new HttpHeaders ({
      'auth-token': JSON.parse(localStorage.getItem('user')).token
    })
  }

  getUserById(userId: String) {
    console.log(this.options);
    console.log(userId);
    // this.options['params'] = {'userId': userId};
    return this.http.get(
      this.apiPath + 
      this.userRoute +
      '/' + userId,
      this.options
      )
      .pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
