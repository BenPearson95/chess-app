import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AdminPageData } from '../_models/admin/admin-page-data';
import { AuthUser } from '../_models/user/auth-user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiPath = environment.apiPath;
  route = 'admin/';
  options = {
    headers: new HttpHeaders ({
      'auth-token': null
    })
  }
  private currentUserSource = new BehaviorSubject<AuthUser>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.authService.loggedIn().subscribe(result => {
      if (result) {
        this.options = {
          headers: new HttpHeaders ({
            'auth-token': JSON.parse(localStorage.getItem('user')).token
          })
        }
      }
    });
   }

  getAdminPageData() {
    return this.http.get(this.apiPath + this.route, this.options )
    .pipe( map((response: AdminPageData) => {
      return response;
    })
    );
  }
}
