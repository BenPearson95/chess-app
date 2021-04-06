import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { FenCollection } from '../_models/board/fen-collection';
import { AuthService } from '../_services/auth.service';
import { FenCollectionsService } from '../_services/fen-collections.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionsResolver implements Resolve<Array<FenCollection>> {
  constructor(
    private authService: AuthService,
    private fenCollectionsService: FenCollectionsService,
    ) {}

  // Resolve data into the collection component.
  resolve(): Observable<Array<FenCollection>> {
    let userId: String = '';
    
    this.authService.currentUser$.subscribe((user) => {
      userId = user._id;
    });

    return this.fenCollectionsService.getCollectionsUserById(userId);
  }
}
