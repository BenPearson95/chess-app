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

  // Save a Fen Collection
  saveFeedback(feedback: Feedback) {
    return this.http.post(this.apiPath + this.route, feedback, this.options)
      .pipe(map((response: any) => {
        return response;
      })
    );
  }
}
