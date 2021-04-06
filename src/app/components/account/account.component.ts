import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/_models/user/account';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  account: Account

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(){
    
    this.getRouteData(this.activatedRoute.snapshot.data.resolvedData);
    console.log(this.account);
  }

  // Get the account data from the route.
  getRouteData(data: Account) {
    this.account = {
      _id: data._id,
      firstname: data.firstname,
      surname: data.surname,
      email: data.email,
      accountType: data.accountType,
      signupDate: data.signupDate      
    };
  }

}
