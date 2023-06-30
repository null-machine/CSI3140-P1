import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomepageComponent} from "./homepage/homepage.component";
import {ReviewComponent} from "./review/review.component";
import {OverviewComponent} from "./overview/overview.component";
import {ListReviewsComponent} from "./review/list-reviews/list-reviews.component";
import {SendReviewComponent} from "./review/send-review/send-review.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";

const routes: Routes =[
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: HomepageComponent},
 /* {path:'c',component: ReviewComponent,
    children:[
      {path:'overview',component:OverviewComponent},
      {path:'list',component:ListReviewsComponent},
      {path:'review',component:SendReviewComponent}
    ],
  },*/
  {
    //the courseId is a place holder that is why we use : at the beginning
    path: 'overview/:courseId',
    component: OverviewComponent
  },
  {
    path: 'review/:courseId',
    component: ReviewComponent
  },
 /* {path: '**', component: HomepageComponent},*/
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
/*  {path: ':userName', redirectTo: '/', pathMatch: 'full'}*/


]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
