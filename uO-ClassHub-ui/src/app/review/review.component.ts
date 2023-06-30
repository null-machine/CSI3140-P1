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

	textField!: HTMLInputElement;
	stars!: HTMLInputElement;
	constructor(private router:Router, private activatedRoute: ActivatedRoute,private httpClient:HttpClient){
	}

	ngOnInit(): void{
		this.courseCode = this.activatedRoute.snapshot.paramMap.get('courseId')!;
		this.textField = document.querySelector('.reviewText') as HTMLInputElement;
		this.stars = document.querySelector('.stars') as HTMLInputElement;
	}

	goBackToHome(){
		this.router.navigate(['/']);
	}

	makeReview(): any{
		const apiUrl = 'http://127.0.0.1:5002/review';
	    const params = new HttpParams()
	    					.set('paramName', this.courseCode)
	    					.set('review', this.textField.value)
	    					.set('reviewer', 'anonymous')
	    					.set('stars',this.stars.value);

	   	this.httpClient.get(apiUrl, { params }).subscribe((data: any) => {
	      // Handle the response data
	      console.log(data);
		  return data;
	    }, (error: any) => {
	      // Handle the error
	      console.error(error);
	    });
	   /* const analysisResult = document.querySelector('.analysisResult') as HTMLInputElement;

	    /*this.httpClient.get(apiUrl, { params }).subscribe((data: any) => {
	      // Handle the response data
	      console.log(data);
		  const analysis = `Compound: ${data.compound}, Negative: ${data.neg}, Neutral: ${data.neu}, Positive: ${data.pos}`;
		  analysisResult.innerHTML = analysis; // Display the analysis
		  return data;
	    }, (error: any) => {
	      // Handle the error
	      console.error(error);
	    });*/
	}
	 
  	seeReviews(){
    	this.router.navigate(['/overview', this.courseCode]);
 	 }


}
