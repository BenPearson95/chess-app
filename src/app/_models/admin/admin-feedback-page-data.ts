import { FeedbackType } from "../enums/feedback-type";

export class AdminFeedbackPageData {
  _id: string;
  feedbackText: string;
  feedbackType: FeedbackType;
  userEmail: string;
  dateTime: string;
}
