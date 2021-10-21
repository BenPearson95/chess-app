import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from '../_models/user/account';
import { AccountService } from '../_services/account.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountResolver implements Resolve<Account> {
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    ) {}

    // Resolve data to the account component.
  resolve(): Observable<Account> {
    return this.accountService.getUserById(this.authService.getUserId());
  }
}
