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
    let userId: string = '';
    
    this.authService.currentUser$.subscribe((user) => {
      userId = user._id;
    });

    return this.accountService.getUserById(userId);
  }
}
