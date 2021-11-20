import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInOut } from 'src/app/_animations/animations';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  animations:[fadeInOut]
})
export class PasswordResetComponent implements OnInit {

  private resetToken: string;
  private userId: string;
  public hidePassword = false;
  public disableBtn = false;

  passwordResetFormGroup: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
  })

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.token && params.id) {
        this.resetToken = params.token;
        this.userId = params.id;
      } else {
        this.router.navigate(['/landing-page']);
      }
    })
  }

  // Validation function to match the password fields.
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
    }
  }

  resetSubmit() {
    this.disableBtn = true;
    const passwordResetObject = {
      resetToken: this.resetToken,
      userId: this.userId,
      password: this.passwordResetFormGroup.controls.password.value,
    };
    this.authService.resetPassword(passwordResetObject).subscribe(result => {
      this.snackBar.open(result.message, null, {duration: 2000});
      this.router.navigate(['/landing-page']);
    }, error => {
      this.snackBar.open(error.error.message, null, {duration: 4000});
      this.disableBtn = false;
    });
  }
}
