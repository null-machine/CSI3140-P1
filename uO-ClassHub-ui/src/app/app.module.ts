import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './homepage/homepage.component';
import { ReviewComponent } from './review/review.component';
import { OverviewComponent } from './overview/overview.component';
import { ListReviewsComponent } from './review/list-reviews/list-reviews.component';
import { SendReviewComponent } from './review/send-review/send-review.component';
import {RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts'; 
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ReviewComponent,
    OverviewComponent,
    ListReviewsComponent,
    SendReviewComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterOutlet,
    HttpClientModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatTableModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
