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
	course_details!: string;
	faculty!: string;
	course_prerequisites!: string;
	speechBubbleText = "";

  loginButton!: HTMLElement;
  signUpButton!: HTMLElement;
  logOutButton!: HTMLElement;

  	posColor = "#008F71";
  	negColor = "#8f001e";
  	neuColor = "blue";
  	allColor = "white";

	constructor(private router:Router, private activatedRoute: ActivatedRoute,private httpClient:HttpClient){
	}

	ngOnInit(): void{
		this.stars = [0,0,0,0,0]
		this.star_percentages = [0,0,0,0,0]
		this.courseCode = this.activatedRoute.snapshot.paramMap.get('courseId')!;
		this.courseCodeWithoutUnits = this.courseCode.replace(/\([^()]*\)/g, "");
		this.courseCodeShortened = this.courseCode.slice(0,8);
		this.loginButton = document.querySelector('#loginButton_overview') as HTMLInputElement;
	    this.signUpButton = document.querySelector('#signUpButton_overview') as HTMLInputElement;
	    this.logOutButton = document.querySelector('#logOutButton_overview') as HTMLInputElement;
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
	    console.log(this.courseCode);
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
	      this.course_description =  data.courseDesc
	      const pattern = /The following courses are offered by./g;
	      const pattern2 = /The following course is offered by./g;

			// Delete all parts of the string matching the pattern
		  const faculty_text = data.faculty.toString();
		  this.faculty= faculty_text.replace(pattern, "").slice(0, -1);
		  this.faculty= this.faculty.replace(pattern2, "");

	      this.course_details= data.courseDetails;
	      this.course_prerequisites= data.coursePrerequisites;
	      console.log(data.courseDesc);
		  if(emotion === data.analysis.neu){
		  	this.allColor = this.neuColor;
	      	this.image.src= "../assets/negative.png";
	      	this.barColor = this.neuColor;
	      	(document.querySelector('.header') as HTMLElement).style.backgroundColor = this.neuColor;
	      	(document.querySelector('.footer') as HTMLElement).style.backgroundColor = this.neuColor;
	      }else if(emotion === data.analysis.pos){
	      	this.allColor = this.posColor;
	      	this.image.src= "../assets/positive.png";
	      	this.barColor = this.posColor;
	      	(document.querySelector('.header') as HTMLElement).style.backgroundColor = this.posColor;
	      	(document.querySelector('.footer') as HTMLElement).style.backgroundColor = this.posColor;
	      }else{
	      	this.allColor = this.negColor;
	      	this.image.src= "../assets/neutral.png";
	      	this.barColor = this.negColor;
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
		localStorage.removeItem('selectedClass');
		this.router.navigate(['/']);
		window.scrollTo(0, 0);
	}

	//Route to review page
	makeReview(){
		const userName = localStorage.getItem('userName');
		if(userName == null){
			this.moveRobot();

			//alert("please login to make a review");
			this.changeSpeech("Please log in to make a review");
			return;
		}
	    this.router.navigate(['/review', this.courseCode]);
	    window.scrollTo(0, 0);
	}
	moveRobot() {
  const robotElement = document.querySelector('.robot')!;
  robotElement.classList.add('move');

  // Remove the 'move' class after the transition completes
  setTimeout(() => {
    robotElement.classList.remove('move');
  }, 2000); // Adjust the duration (in milliseconds) to control the speed of the movement
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
  	console.log("logged_out");
    localStorage.removeItem('userName'); // Delete the userName from localStorage
    this.userName = null;
    this.loginButton.style.visibility="visible";
    this.signUpButton.style.visibility="visible";
    this.logOutButton.style.visibility="hidden";
  }

  changeSpeech(text:string){
    this.speechBubbleText = text;
  }

  showCourseDescription(){
  	(document.querySelector('.course_description') as HTMLInputElement).style.visibility ="visible";

  }
  hideCourseDescription(){
  	(document.querySelector('.course_description') as HTMLInputElement).style.visibility ="hidden";

  }




}


