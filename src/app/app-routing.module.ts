import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './components/collections/collections.component';
import { AccountComponent } from './components/account/account.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { BoardComponent } from './components/board/board.component';
import { AuthGuard } from './_guards/auth.guard';
import { AccountResolver } from './_resolvers/account.resolver';
import { CollectionsResolver } from './_resolvers/collections.resolver';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

const routes: Routes = [



  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingPageComponent,
    data: {
      name: 'Chess App',
      showBackButton: false,
    }
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
    path: 'collections',
    component: CollectionsComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    resolve: {
      resolvedData: CollectionsResolver,
    },
    data: {
      name: 'Collections',
      showBackButton: true,
      animation: 'isLeft',
    },
  },
  {
    path: 'account',
    component: AccountComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    resolve: {
      resolvedData: AccountResolver,
    },
    data: {
      name: 'Information',
      showBackButton: true,
      animation: 'isAbove',
      
    },
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    data: {
      name: 'Admin Dashboard',
      showBackButton: true,
      animation: 'isRight',
    },
  },
  { 
    path: '**',
    redirectTo:'landing',
  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
