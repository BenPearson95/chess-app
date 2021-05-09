import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './components/collections/collections.component';
import { AccountComponent } from './components/account/account.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { BoardComponent } from './components/board/board.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InformationComponent } from './components/information/information.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoggedInGuard } from './_guards/logged-in.guard';
import { AccountResolver } from './_resolvers/account.resolver';
import { CollectionsResolver } from './_resolvers/collections.resolver';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LoginSignupComponent,
    canActivate: [LoggedInGuard],
    data: {
      name: 'Login/Signup',
      showBackButton: false,
      animation: 'isLeft',
    }
  },
  {
    path: 'login',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'landing',
        component: LandingPageComponent,
        data: {
          name: 'Landing Page',
          showBackButton: false,
        }
      },
      // { 
      //   path: 'dashboard',
      //   component: DashboardComponent,
      //   data: {
      //     name: 'Dashboard',
      //     showBackButton: false,
      //   },
      // },
      {
        path: 'collections',
        component: CollectionsComponent,
        resolve: {
          resolvedData: CollectionsResolver,
        },
        data: {
          name: 'Collections',
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
        path: 'account',
        component: AccountComponent,
        resolve: {
          resolvedData: AccountResolver,
        },
        data: {
          name: 'Information',
          showBackButton: true,
          animation: 'isRight',
          
        },
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        data: {
          name: 'Admin Dashboard',
          showBackButton: true,
          animation: 'isRight',
        },
      },
      
      {
        path: '**',
        component: LandingPageComponent, 
        pathMatch: 'full',
        data: {
          name: 'Landing Page',
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
