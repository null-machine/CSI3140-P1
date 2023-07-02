import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import * as $ from 'jquery';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
	courseCode!: string ;
	courseCodeWithoutUnits! :string;
	courseCodeShortened!: string;
	courseData! : Object;
	stars!: number[];
	reviews!: string;
	star_percentages!: number[];
	userName: string | null = null;
	speachBubble!: HTMLElement;
	image!: HTMLImageElement;
	barColor!: string;
	course_description!: string;
	speechBubbleText = "";

  loginButton!: HTMLElement;
  signUpButton!: HTMLElement;
  logOutButton!: HTMLElement;

  	posColor = "green";
  	negColor = "red";
  	neuColor = "blue";

	constructor(private router:Router, private activatedRoute: ActivatedRoute,private httpClient:HttpClient){
	}

	ngOnInit(): void{
		this.stars = [0,0,0,0,0]
		this.star_percentages = [0,0,0,0,0]
		this.courseCode = this.activatedRoute.snapshot.paramMap.get('courseId')!;
		this.courseCodeWithoutUnits = this.courseCode.replace(/\([^()]*\)/g, "");
		this.courseCodeShortened = this.courseCode.slice(0,8);
		this.loginButton = document.querySelector('#loginButton') as HTMLInputElement;
	    this.signUpButton = document.querySelector('#signUpButton') as HTMLInputElement;
	    this.logOutButton = document.querySelector('#logOutButton') as HTMLInputElement;
	    this.speachBubble = document.querySelector('#speechTextOverview') as HTMLElement;
	    this.image = document.querySelector('#image') as HTMLImageElement;
	    this.userName = localStorage.getItem('userName');
	    if(this.userName === null){
	      this.loginButton.style.visibility="visible";
	      this.signUpButton.style.visibility="visible";
	      this.logOutButton.style.visibility="hidden";
	    }else{
	      this.loginButton.style.visibility="hidden";
	      this.signUpButton.style.visibility="hidden";
	      this.logOutButton.style.visibility="visible";
	    }
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
	      const total_stars = this.stars[0] +this.stars[1]+this.stars[2]+this.stars[3]+this.stars[4]; 
		  this.star_percentages[0] = Math.floor(this.stars[0]/total_stars *100);
		  this.star_percentages[1] = Math.floor(this.stars[1]/total_stars *100);
		  this.star_percentages[2] = Math.floor(this.stars[2]/total_stars *100);
		  this.star_percentages[3] = Math.floor(this.stars[3]/total_stars *100);
		  this.star_percentages[4] = Math.floor(this.stars[4]/total_stars *100);


	      const reviewsText = document.querySelector('#reviews') as HTMLInputElement;
	      const container = document.getElementById('container')!;
	      //reviewsText.innerHTML = reviews.join(', ');


	      //Analysis results
		  const analysis = `Compound: ${data.analysis.compound}, Negative: ${data.analysis.neg}, Neutral: ${data.analysis.neu}, Positive: ${data.analysis.pos}`;
		  analysisResult.innerHTML = analysis;
		  	      this.reviews = data.reviews;
	      const emotion = Math.max(data.analysis.neg,data.analysis.neu,data.analysis.pos);
	      console.log(emotion);
	      this.course_description = data.courseDesc;
	      console.log(data.courseDesc);
		  if(emotion === data.analysis.neu){
	      	this.image.src= "../assets/negative.png";
	      	this.barColor = "blue";
	      	(document.querySelector('.header') as HTMLElement).style.backgroundColor = this.neuColor;
	      	(document.querySelector('.footer') as HTMLElement).style.backgroundColor = this.neuColor;
	      }else if(emotion === data.analysis.pos){
	      	this.image.src= "../assets/positive.png";
	      	this.barColor = "green";
	      	(document.querySelector('.header') as HTMLElement).style.backgroundColor = this.posColor;
	      	(document.querySelector('.footer') as HTMLElement).style.backgroundColor = this.posColor;
	      }else{
	      	this.image.src= "../assets/neutral.png";
	      	this.barColor = "red";
	      	(document.querySelector('.header') as HTMLElement).style.backgroundColor = this.negColor;
	      	(document.querySelector('.footer') as HTMLElement).style.backgroundColor = this.negColor;
	      }
	      
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
			  	listItem.style.backgroundColor = "#2b2445";
			  	listItem.style.boxShadow = '-4px 4px rgba(0, 0, 0, 0.4)';
			  	listItem.style.margin = "10px";
			 	container.appendChild(listItem);
			 
			});
		console.log(this.reviews);
			if(this.reviews.length<1){
				this.changeSpeech("There's no reviews on this course yet");
				return data;
			} 
			if(this.reviews.length == 1){
				this.changeSpeech(this.reviews.length+" student reviewed this course");
				return data;
			}
			this.changeSpeech(this.reviews.length+" students reviewed this course");

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
			this.changeSpeech("Please log in to make a review");
			return;
		}
	    this.router.navigate(['/review', this.courseCode]);
	    window.scrollTo(0, 0);
	}
  //Routes to login page
  login(){
    this.router.navigate(['/login']);
    window.scrollTo(0, 0);
  }

  //Routes to signup page
  signUp(){
    this.router.navigate(['/signup']);
    window.scrollTo(0, 0);
  }

  //Routes to logout page
  logOut(){
    localStorage.removeItem('userName'); // Delete the userName from localStorage
    this.userName = null;
    this.router.navigate(['/'], { skipLocationChange: true });
    this.loginButton.style.visibility="visible";
    this.signUpButton.style.visibility="visible";
    this.logOutButton.style.visibility="hidden";
  }

  changeSpeech(text:string){
    this.speechBubbleText = text;
  }




}


