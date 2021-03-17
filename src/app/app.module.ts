import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { BoardComponent } from './board/board.component';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InformationComponent } from './information/information.component';
import { SavedGamesComponent } from './saved-games/saved-games.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ToolBarComponent,
    BoardComponent,
    LoginSignupComponent,
    InformationComponent,
    SavedGamesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    NgxChessBoardModule.forRoot(),
    MatSliderModule,
    MatListModule,
    MatSlideToggleModule,
    MatInputModule,
    MatTabsModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
