import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { BoardComponent } from './components/board/board.component';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InformationComponent } from './components/information/information.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccountComponent } from './components/account/account.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { MatSelectModule } from '@angular/material/select';
import { ManageFenComponent } from './components/manage-fen/manage-fen.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CollectionsComponent } from './components/collections/collections.component';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HelpComponent } from './components/help/help.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgArrayPipesModule } from 'ngx-pipes';
import { MoveHistoryComponent } from './components/move-history/move-history.component';
import {MatChipsModule} from '@angular/material/chips';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ToolBarComponent,
    BoardComponent,
    LoginSignupComponent,
    InformationComponent,
    AccountComponent,
    AdminDashboardComponent,
    ManageFenComponent,
    CollectionsComponent,
    HelpComponent,
    FeedbackComponent,
    MoveHistoryComponent,
    LandingPageComponent,
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
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    MatSnackBarModule,
    MatTableModule,
    DragDropModule,
    MatExpansionModule,
    NgArrayPipesModule,
    MatChipsModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
