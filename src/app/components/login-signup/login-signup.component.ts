import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { AuthUser } from '../../_models/user/auth-user';
import { UserLogin } from '../../_models/user/user-login';
import { UserSignup } from '../../_models/user/user-signup';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  signupForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
  });

  showHidePassword = true;
  loginError = '';
  signupError= '';
  userAlreadyExists = false;

  constructor(
    private AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    // Subscribe for any changes to the Password field, 
    // so confirm Password can show up-to-date error.
    this.signupForm.controls.password.valueChanges.subscribe(() => {
      this.signupForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  // Validation function to match the password fields.
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
    }
  }

  // Submit Function.
  loginSubmit() {
    const userLogin = new UserLogin(
      this.loginForm.value.email,
      this.loginForm.value.password,
    );

    // Call to the User Service.
    this.AuthService.loginUser(userLogin).subscribe((result: AuthUser) => {
    }, error => {
      this.loginError = error.error;
    });
  }

  // Signup Function.
  signupSubmit() {
    const userSignup = new UserSignup(
      this.signupForm.value.firstname,
      this.signupForm.value.surname,
      this.signupForm.value.email,
      this.signupForm.value.password,
    );
    
    // Call to the User Service.
    this.AuthService.signupUser(userSignup).subscribe(result => {
    }, error => {
      this.signupError = error.error;
    });
  }

}
