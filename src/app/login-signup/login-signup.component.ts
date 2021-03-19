import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUser } from '../_models/user/auth-user';
import { UserLogin } from '../_models/user/user-login';
import { UserSignup } from '../_models/user/user-signup';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  signupForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  showHidePassword = true;
  userAlreadyExists = false;

  constructor(
    private userService: UserService,
    private router: Router,
  ) { 
  }

  ngOnInit(): void {
  }

  loginSubmit() {
    const userLogin = new UserLogin(
      this.loginForm.value.email,
      this.loginForm.value.password,
    );

    this.userService.loginUser(userLogin).subscribe((result: AuthUser) => {
      
    }, error => {
      console.log(error);
    });
  }

  signupSubmit() {
    console.log(this.signupForm.value);
    const userSignup = new UserSignup(
      this.signupForm.value.firstname,
      this.signupForm.value.surname,
      this.signupForm.value.email,
      this.signupForm.value.password,
    );

    this.userService.signupUser(userSignup).subscribe(result => {
      console.log(result);
    }, error => {
      this.userAlreadyExists = true;
      console.log(error);
    })
  }

}
