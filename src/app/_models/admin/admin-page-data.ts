import { AdminFeedbackPageData } from "./admin-feedback-page-data";
import { AdminUserPageData } from "./admin-user-page-data";

export class AdminPageData {
  user: Array<AdminUserPageData>;
  feedbacks: Array<AdminFeedbackPageData>;
}
