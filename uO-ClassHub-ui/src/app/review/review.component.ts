import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
	courseCode!: string ;
	courseData! : Object;
	userName!: string;

	textField!: HTMLInputElement;
	stars!: HTMLInputElement;
	anonymousReview!: HTMLInputElement;
	constructor(private router:Router, private activatedRoute: ActivatedRoute,private httpClient:HttpClient){
	}

	ngOnInit(): void{
		this.anonymousReview = document.querySelector('#anonymous') as HTMLInputElement;
		this.courseCode = this.activatedRoute.snapshot.paramMap.get('courseId')!;
		this.textField = document.querySelector('.reviewText') as HTMLInputElement;
		this.stars = document.querySelector('.stars') as HTMLInputElement;
	}

	goBackToHome(){
		this.router.navigate(['/']);
	}

	//Connects to http://127.0.0.1:5002/review which has the method to insert the review into the database
	//Inserts the review and stars into the database
	makeReview(): any{
		var isChecked = this.anonymousReview.checked;
		if(isChecked){
			this.userName = 'anonymous';
		}else{
			this.userName = localStorage.getItem('userName')!;
		}
		console.log(isChecked);
		const apiUrl = 'http://127.0.0.1:5002/review';
	    const params = new HttpParams()
	    					.set('paramName', this.courseCode)
	    					.set('review', this.textField.value)
	    					.set('reviewer', this.userName)
	    					.set('stars',this.stars.value);

	   	this.httpClient.get(apiUrl, { params }).subscribe((data: any) => {
	      console.log(data);
		  return data;
	    }, (error: any) => {
	      console.error(error);
	    });
	}
	 
  	seeReviews(){
    	this.router.navigate(['/overview', this.courseCode]);
 	 }


}
