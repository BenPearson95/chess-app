import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Grid } from '../_models/board/grid';
import { UserBoardProfile } from '../_models/board/user-board-profile';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  grids: Array<Grid> = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  apiPath = environment.apiPath;
  route = 'board/';
  options = {
    headers: new HttpHeaders ({
      'auth-token': JSON.parse(localStorage.getItem('user')).token
    })
  }

  // Init the grids. Ew.
  initGrids() {
    this.grids.push({gridNum: 1, coord: 'a8' });
    this.grids.push({gridNum: 2, coord: 'b8' });
    this.grids.push({gridNum: 3, coord: 'c8' });
    this.grids.push({gridNum: 4, coord: 'd8' });
    this.grids.push({gridNum: 5, coord: 'e8' });
    this.grids.push({gridNum: 6, coord: 'f8' });
    this.grids.push({gridNum: 7, coord: 'g8' });
    this.grids.push({gridNum: 8, coord: 'h8' });
    this.grids.push({gridNum: 9, coord: 'a7' });
    this.grids.push({gridNum: 10, coord: 'b7' });
    this.grids.push({gridNum: 11, coord: 'c7' });
    this.grids.push({gridNum: 12, coord: 'd7' });
    this.grids.push({gridNum: 13, coord: 'e7' });
    this.grids.push({gridNum: 14, coord: 'f7' });
    this.grids.push({gridNum: 15, coord: 'g7' });
    this.grids.push({gridNum: 16, coord: 'h7' });
    this.grids.push({gridNum: 17, coord: 'a6' });
    this.grids.push({gridNum: 18, coord: 'b6' });
    this.grids.push({gridNum: 19, coord: 'c6' });
    this.grids.push({gridNum: 20, coord: 'd6' });
    this.grids.push({gridNum: 21, coord: 'e6' });
    this.grids.push({gridNum: 22, coord: 'f6' });
    this.grids.push({gridNum: 23, coord: 'g6' });
    this.grids.push({gridNum: 24, coord: 'h6' });
    this.grids.push({gridNum: 25, coord: 'a5' });
    this.grids.push({gridNum: 26, coord: 'b5' });
    this.grids.push({gridNum: 27, coord: 'c5' });
    this.grids.push({gridNum: 28, coord: 'd5' });
    this.grids.push({gridNum: 29, coord: 'e5' });
    this.grids.push({gridNum: 30, coord: 'f5' });
    this.grids.push({gridNum: 31, coord: 'g5' });
    this.grids.push({gridNum: 32, coord: 'h5' });
    this.grids.push({gridNum: 33, coord: 'a4' });
    this.grids.push({gridNum: 34, coord: 'b4' });
    this.grids.push({gridNum: 35, coord: 'c4' });
    this.grids.push({gridNum: 36, coord: 'd4' });
    this.grids.push({gridNum: 37, coord: 'e4' });
    this.grids.push({gridNum: 38, coord: 'f4' });
    this.grids.push({gridNum: 39, coord: 'g4' });
    this.grids.push({gridNum: 40, coord: 'h4' });
    this.grids.push({gridNum: 41, coord: 'a3' });
    this.grids.push({gridNum: 42, coord: 'b3' });
    this.grids.push({gridNum: 43, coord: 'c3' });
    this.grids.push({gridNum: 44, coord: 'd3' });
    this.grids.push({gridNum: 45, coord: 'e3' });
    this.grids.push({gridNum: 46, coord: 'f3' });
    this.grids.push({gridNum: 47, coord: 'g3' });
    this.grids.push({gridNum: 48, coord: 'h3' });
    this.grids.push({gridNum: 49, coord: 'a2' });
    this.grids.push({gridNum: 50, coord: 'b2' });
    this.grids.push({gridNum: 51, coord: 'c2' });
    this.grids.push({gridNum: 52, coord: 'd2' });
    this.grids.push({gridNum: 53, coord: 'e2' });
    this.grids.push({gridNum: 54, coord: 'f2' });
    this.grids.push({gridNum: 55, coord: 'g2' });
    this.grids.push({gridNum: 56, coord: 'h2' });
    this.grids.push({gridNum: 57, coord: 'a1' });
    this.grids.push({gridNum: 58, coord: 'b1' });
    this.grids.push({gridNum: 59, coord: 'c1' });
    this.grids.push({gridNum: 60, coord: 'd1' });
    this.grids.push({gridNum: 61, coord: 'e1' });
    this.grids.push({gridNum: 62, coord: 'f1' });
    this.grids.push({gridNum: 63, coord: 'g1' });
    this.grids.push({gridNum: 64, coord: 'h1' });
  }

  saveBoardProfile(userBoardProfile: UserBoardProfile) {
    let userId = null; 
    this.authService.currentUser$.subscribe(user => {userId = user._id});

    return this.http.put(this.apiPath + this.route, { userId: userId, userBoardProfile: userBoardProfile }, this.options)
      .pipe(map((response: any) => {
        return response;
      })
    );
  }

  getBoardProfile(userId: string) {
    return this.http.get(this.apiPath + this.route + userId, this.options )
    .pipe( map((response: any) => {
      return response;
    })
    );
  }
}
