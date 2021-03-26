import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FenCollection } from '../_models/board/fen-collection';

@Injectable({
  providedIn: 'root'
})
export class FenCollectionsService {

  constructor(
      private http: HttpClient,
  ) { }

  apiPath = environment.apiPath;
  route = 'collections/';
  options = {
    headers: new HttpHeaders ({
      'auth-token': JSON.parse(localStorage.getItem('user')).token
    })
  }

  saveCollection(collection: FenCollection) {
    console.log(collection);
    return this.http.post(this.apiPath + this.route, collection, this.options)
      .pipe(map((response: any) => {
        return response;
      })
    );
  }

  getCollectionById(collectionId: String) {
    return this.http.get(this.apiPath + this.route + `/collectionId/${collectionId}`, this.options)
      .pipe(map((response: any) => {
        return response;
      })
    );
  }

  getCollectionsUserById(userId: String) {
    return this.http.get(this.apiPath + this.route + `/userId/${userId}`, this.options)
      .pipe(map((response: any) => {
        return response;
      })
    );
  }

  updateCollectionByID(collection: FenCollection) {
    return this.http.put(this.apiPath + this.route, collection, this.options)
      .pipe(map((response: any) => {
        return response;
      })
    );
  }

  deleteCollectionById(collectionId: String) {
    return this.http.delete(this.apiPath + this.route + `/collectionId/${collectionId}`, this.options)
      .pipe(map((response: any) => {
        return response;
      })
    );
  }
}
