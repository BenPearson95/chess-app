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
  ) { }

  apiPath = environment.apiPath;
  userRoute = 'user/';
  options = {
    headers: new HttpHeaders ({
      'auth-token': JSON.parse(localStorage.getItem('user')).token
    })
  }

  // Get User by ID
  getUserById(userId: String) {
    return this.http.get(this.apiPath + this.userRoute + '/' + userId, this.options )
      .pipe( map((response: any) => {
        return response;
      })
    );
  }
}
