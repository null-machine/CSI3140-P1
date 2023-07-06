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
	courseCodeShortened!: string;

	textField!: HTMLInputElement;
	stars!: HTMLInputElement;
	speechBubble!: HTMLElement;
	anonymousReview = false;
	anonymousButton!:  HTMLInputElement;
	constructor(private router:Router, private activatedRoute: ActivatedRoute,private httpClient:HttpClient){
	}

	ngOnInit(): void{
		this.userName = localStorage.getItem('userName')!;
		//If the user tries to access to this page from the url without loging in
		if(this.userName === null){
			this.router.navigate(['/']);
		}
		this.speechBubble = document.querySelector('.speech_bubble_review')!;
		this.courseCode = this.activatedRoute.snapshot.paramMap.get('courseId')!;
		this.courseCodeShortened = this.courseCode.slice(0,8);
		this.textField = document.querySelector('.reviewText') as HTMLInputElement;
		this.stars = document.querySelector('#stars') as HTMLInputElement;
		this.anonymousButton = document.querySelector('#anonymousButton') as HTMLInputElement;
	}

	goBackToHome(){
		localStorage.removeItem('selectedClass');
		this.router.navigate(['/']);
		window.scrollTo(0, 0);
	}

	//Connects to http://127.0.0.1:5002/review which has the method to insert the review into the database
	//Inserts the review and stars into the database
	makeReview(): any{
		if(this.textField.value === ''){
			this.changeSpeech("Please enter a review");
			return;
		}
		if(this.textField.value.length < 20){
			this.changeSpeech("Please write a longer review");
			return;
		}
		this.changeSpeech("Submitting review");

		var checkmark = document.getElementById('checkmark')!;
		checkmark.style.display = "block";
	  setTimeout(() => {
	    checkmark.style.display = "none";
	    this.changeSpeech("Review submitted");
	  }, 5200); // Hide after 2 seconds



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
    	window.scrollTo(0, 0);
 	 }

 	setAnonymous(){
 		this.anonymousReview = !this.anonymousReview;
 		if(this.anonymousReview){
 			//Change button's color
 			this.anonymousButton.classList.add('anonymousMode');
 			this.anonymousButton.innerHTML = "Click back to review as " + this.userName; 
 			this.userName = 'Anonymous';
 			this.changeSpeech("Anonymous mode activated");
 			(document.querySelector('.header')! as HTMLInputElement).style.backgroundColor = "black";
 			(document.querySelector('.footer')! as HTMLInputElement).style.backgroundColor = "black";
 		}else{
 			this.anonymousButton.classList.remove('anonymousMode');
 			this.userName = localStorage.getItem('userName')!;
 			this.anonymousButton.innerHTML = "Click to review anonymously"; 
 			this.changeSpeech("Reviewing as " + this.userName);
 			(document.querySelector('.header')! as HTMLInputElement).style.backgroundColor = "#cacdd0 ";
 			(document.querySelector('.footer')! as HTMLInputElement).style.backgroundColor = "#cacdd0 ";
 		}
 	}


  	changeSpeech(text:string){
    	this.speechBubble.innerHTML = text;
  	}


}
