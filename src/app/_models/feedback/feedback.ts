import { FeedbackType } from "../enums/feedback-type";

export class Feedback {
  constructor(
    public _id: string,
    public feedbackType: FeedbackType,
    public feedbackText: string,
    public userEmail: string,
    public dateTime: Date,
  ) {}
}
