import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminPageData } from '../_models/admin/admin-page-data';
import { AdminService } from '../_services/admin.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminResolver implements Resolve<AdminPageData> {
  private loggedIn: boolean = false;
  private isAdmin: boolean = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {
    this.authService.loggedIn().subscribe(result => {this.loggedIn = (result) ?  true : false});
    this.authService.isAdmin().subscribe(result => {this.isAdmin = (result) ? true : false});
  }

  resolve(): Observable<AdminPageData> {
    if (this.loggedIn && this.isAdmin) {
      return this.adminService.getAdminPageData();
    } else {
      return null;
    }
  }
}
