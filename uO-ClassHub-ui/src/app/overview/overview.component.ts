import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
	courseCode!: string ;
	courseData! : Object;

	constructor(private router:Router, private activatedRoute: ActivatedRoute,private httpClient:HttpClient){
	}

	ngOnInit(): void{
		this.courseCode = this.activatedRoute.snapshot.paramMap.get('courseId')!;
		this.sentimentAnalysis();
	}

	sentimentAnalysis(): any {
	    const apiUrl = 'http://127.0.0.1:5002/overview';
	    const params = new HttpParams().set('paramName', this.courseCode);
	    const analysisResult = document.querySelector('.analysisResult') as HTMLInputElement;

	    //Connects to http://127.0.0.1:5002/overview which has the sentiment analysis method
	    //Gets the sentiment analysis and puts it into the analysisResult html field
	    this.httpClient.get(apiUrl, { params }).subscribe((data: any) => {
	      console.log(data);

	      //Analysis results
		  const analysis = `Compound: ${data.compound}, Negative: ${data.neg}, Neutral: ${data.neu}, Positive: ${data.pos}`;
		  analysisResult.innerHTML = analysis; 

		  return data;
	    }, (error: any) => {
	      // Handle the error
	      console.error(error);
	    });
	  }

	//Route back to home page
	goBackToHome(){
		this.router.navigate(['/']);
	}

	//Route to review page
	makeReview(){
		const userName = localStorage.getItem('userName');
		if(userName == null){
			alert("please login to make a review");
			return;
		}
	    this.router.navigate(['/review', this.courseCode]);
	}


}
