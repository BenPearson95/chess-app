import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Feedback } from 'src/app/_models/feedback/feedback';
import { FeedbackService } from 'src/app/_services/feedback.service';
import { FeedbackType } from "../../_models/enums/feedback-type";
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  feedbackType = FeedbackType;
  error: String = '';

  feedbackFormGroup = new FormGroup({
    feedbackType: new FormControl('', Validators.required),
    feedbackText: new FormControl('', Validators.required),
  })

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<FeedbackComponent>,
    private authService: AuthService,
    private feedbackService: FeedbackService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  // Submit the Feedback
  feedbackSubmit() {

    let userEmail: string; 
    
    this.authService.currentUser$.subscribe(user => {
      userEmail = user.email
    });

    const feedbackPayload: Feedback = {
      _id: null,
      feedbackType: this.feedbackFormGroup.controls.feedbackType.value,
      feedbackText: this.feedbackFormGroup.controls.feedbackText.value,
      userEmail: userEmail,
      dateTime: null,
    }

    this.feedbackService.saveFeedback(feedbackPayload).subscribe(result => {
      this.snackBar.open('Thank you for your message.', null, {duration: 2000,});
      this.closeFeedback();
    }, error => {
      this.error = error.message;
    })
  }

  closeFeedback() {
    this.dialogRef.close();
  }

}
