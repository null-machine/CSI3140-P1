import { Component } from '@angular/core';
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  constructor(private router:Router, private route: ActivatedRoute,private httpClient:HttpClient ){}
  // switchCoursePage() {
  //   this.router.navigate('course')
  // }

  courseCode='';
  courseData : JSON | undefined;

  search() {
    console.log(this.courseCode);
    // this.router.navigate(['course',this.courseCode]);
  }

  getValue(value: string) {
    this.courseCode = value;
  }
  getAllCourseData(){
    this.httpClient.get('http://127.0.0.1:5000/courses').subscribe(data => {
      this.courseData = data as JSON;
      console.log(this.courseData);
    })
  }
}
