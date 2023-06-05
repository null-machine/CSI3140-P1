import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomepageComponent} from "./homepage/homepage.component";
import {ReviewComponent} from "./review/review.component";
import {OverviewComponent} from "./review/overview/overview.component";
import {ListReviewsComponent} from "./review/list-reviews/list-reviews.component";
import {SendReviewComponent} from "./review/send-review/send-review.component";

const routes: Routes =[
  {path: '', redirectTo: '/', pathMatch: 'full'},

  {path: '', component: HomepageComponent},
  {path:'c',component: ReviewComponent,
    children:[
      {path:'overview',component:OverviewComponent},
      {path:'list',component:ListReviewsComponent},
      {path:'review',component:SendReviewComponent}
    ],
  },
  {path: '**', component: HomepageComponent},

]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
