import { Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
	course!: string ;
	courseData! : Object;
	constructor(private activatedRoute: ActivatedRoute,private httpClient:HttpClient){
	}

	ngOnInit(): void{
		this.course = this.activatedRoute.snapshot.paramMap.get('courseId')!;
		this.sentimentAnalysis();
	}

	sentimentAnalysis(): any {
	    const apiUrl = 'http://127.0.0.1:5002/overview';
	    const params = new HttpParams().set('paramName', this.course);
	    const analysisResult = document.querySelector('.analysisResult') as HTMLInputElement;

	    this.httpClient.get(apiUrl, { params }).subscribe((data: any) => {
	      // Handle the response data
	      console.log(data);
		  const analysis = `Compound: ${data.compound}, Negative: ${data.neg}, Neutral: ${data.neu}, Positive: ${data.pos}`;
		  analysisResult.innerHTML = analysis; // Display the analysis
		  return data;
	    }, (error: any) => {
	      // Handle the error
	      console.error(error);
	    });
	  }
}
