import { Injectable } from '@angular/core';
import {Resolve } from '@angular/router';
import { Observable} from 'rxjs';
import { UserBoardProfile } from '../_models/board/user-board-profile';
import { AuthService } from '../_services/auth.service';
import { BoardService } from '../_services/board.service';

@Injectable({
  providedIn: 'root'
})
export class BoardResolver implements Resolve<UserBoardProfile> {
  private loggedIn: boolean = false;
  constructor(
    private authService: AuthService,
    private boardService: BoardService,
  ) {
    this.authService.loggedIn().subscribe(result => {this.loggedIn = (result) ?  true : false});
  }

  resolve(): Observable<UserBoardProfile> {
    if (this.loggedIn) {
      return this.boardService.getBoardProfile(this.authService.getUserId());
    } else {
      return null;
    }
  }
}
