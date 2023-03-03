import { FeedbackType } from "../enums/feedback-type";

export class Feedback {
  constructor(
    public _id: string,
    public feedbackType: FeedbackType,
    public feedbackText: string,
    public userId: string,
    public dateTime: Date,
  ) {}
}
