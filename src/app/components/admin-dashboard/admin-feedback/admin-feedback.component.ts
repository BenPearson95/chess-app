import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminFeedbackPageData } from 'src/app/_models/admin/admin-feedback-page-data';
import { FeedbackType } from 'src/app/_models/enums/feedback-type';
import { FeedbackService } from 'src/app/_services/feedback.service';

@Component({
  selector: 'app-admin-feedback',
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./admin-feedback.component.scss']
})
export class AdminFeedbackComponent implements OnInit {
  @Input() feedbacks: Array<AdminFeedbackPageData>

  feedbackForms: Array<FormGroup> = [];

  feedbackReplyForm = new FormGroup({
    replyText: new FormControl('', Validators.required),
  })

  get FeedbackType(): typeof FeedbackType {
    return FeedbackType;
  }

  constructor(
    private feedbackService: FeedbackService,

  ) { }

  ngOnInit(): void {
    this.generateForms();
  }

  generateForms() {
    this.feedbacks.forEach(feedback => {
      this['feedbackReplyForm' + feedback._id] = new FormGroup({
        replyText: new FormControl(),
      });

      this['feedbackReplyForm' + feedback._id].controls['replyText'].disable();

      this.feedbackForms.push(this['feedbackReplyForm' + feedback._id]);
    });
  }

  deleteFeedback(feedbackId: string) {
    this.feedbackService.deleteFeedback(feedbackId).subscribe(result => {
      this.getFeedback();
    });
  }

  getFeedback() {
    this.feedbackService.getFeedback().subscribe(result => {
      this.feedbacks = result;
    })
  }

  submitReply(form: FormGroup) {
    // for future dev.
  }

}
