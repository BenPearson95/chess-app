import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InformationComponent } from './information/information.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { SavedGamesComponent } from './saved-games/saved-games.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginSignupComponent,
    data: {
      name: 'Login/Signup',
      showBackButton: false,
      animation: 'isLeft',
    }
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          name: 'Dashboard',
          showBackButton: false,
        },
      },
      {
        path: 'saved-games',
        component: SavedGamesComponent,
        data: {
          name: 'Saved Games',
          showBackButton: true,
          animation: 'isRight',
        },
      },
      {
        path: 'board',
        component: BoardComponent,
        data: {
          name: 'The Board',
          showBackButton: true,
          animation: 'isRight',
        },
      },
      {
        path: 'information',
        component: InformationComponent,
        data: {
          name: 'Information',
          showBackButton: true,
          animation: 'isRight',
        },
      },
      {
        path: '**',
        component: DashboardComponent, 
        pathMatch: 'full',
        data: {
          name: 'Dashboard',
          showBackButton: false,
        },
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
