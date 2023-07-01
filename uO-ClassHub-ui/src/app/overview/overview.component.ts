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
	stars!: number[];
	reviews!: string;

	constructor(private router:Router, private activatedRoute: ActivatedRoute,private httpClient:HttpClient){
	}

	ngOnInit(): void{
		this.stars = [0,0,0,0,0]
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
	      console.log(data.stars);
	      this.stars = data.stars;
	      const reviewsText = document.querySelector('#reviews') as HTMLInputElement;
	      const container = document.getElementById('container')!;
	      //reviewsText.innerHTML = reviews.join(', ');
	      this.reviews = data.reviews;
	      
		data.reviews.forEach((userAndReview: string) => {
				const listItem = document.createElement('ul');
			    const listItem1 = document.createElement('li');
			  	listItem1.textContent = "Reviewer = " + userAndReview[1];
			  	listItem.appendChild(listItem1);
			  	const listItem2 = document.createElement('li');
			  	listItem2.textContent = "Review = " + userAndReview[0];
			  	listItem.appendChild(listItem2);
			  	const listItem3 = document.createElement('li');
			  	listItem3.textContent = "Stars given= " + userAndReview[2];
			  	listItem.appendChild(listItem3);
			  	listItem.style.backgroundColor = "#808080";
			  	listItem.style.margin = "10px";
			 	container.appendChild(listItem);
			 
			});

	      //Analysis results
		  const analysis = `Compound: ${data.analysis.compound}, Negative: ${data.analysis.neg}, Neutral: ${data.analysis.neu}, Positive: ${data.analysis.pos}`;
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
