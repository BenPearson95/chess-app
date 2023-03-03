import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Feedback } from '../_models/feedback/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private http: HttpClient,
) { }

  apiPath = environment.apiPath;
  route = 'feedback/';
  options = {
    headers: new HttpHeaders ({
      'auth-token': JSON.parse(localStorage.getItem('user')).token
    })
  }

  // Save Feedback
  saveFeedback(feedback: Feedback) {
    return this.http.post(this.apiPath + this.route, feedback, this.options)
      .pipe(map((response: any) => {
        return response;
      })
    );
  }

  // Delete Feedback
  deleteFeedback(feedbackId: string) {
    return this.http.delete(this.apiPath + this.route + `${feedbackId}`, this.options)
      .pipe(map((response: any) => {
        return response;
      })
    );
  }

  // Get Feedback
  getFeedback() {
    return this.http.get(this.apiPath + this.route, this.options)
    .pipe( map((response: any) => {
      return response;
    })
    );
  }
}
