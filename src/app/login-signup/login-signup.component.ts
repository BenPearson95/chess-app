import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  hide = true;

  constructor(
    private userService: UserService,
    private router: Router,
  ) { 
  }

  ngOnInit(): void {
  }

  loginSubmit() {
    console.log(this.loginForm.value);
    const userLogin = new UserLogin(
      this.loginForm.value.email,
      this.loginForm.value.password,
    );
    console.log(userLogin);

    this.userService.loginUser(userLogin).subscribe(result => {
      console.log(result);
      if(Object.keys(result).length!== 0) this.router.navigate(['dashboard']);
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
      console.log(error);
    })
  }

}
