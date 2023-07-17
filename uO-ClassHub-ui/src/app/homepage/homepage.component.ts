import { Component } from '@angular/core';
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})


export class HomepageComponent {
  constructor(private router:Router, private route: ActivatedRoute,private httpClient:HttpClient ){
  }

ngOnInit(): void {
    this.loadHomePage();
  }
  async loadHomePage() {
    //Initializes the course data
    this.getAllCourseData();
   
  
    console.log("loaded");

    this.userName = localStorage.getItem('userName');

    this.speachBubble = document.querySelector('#speechText') as HTMLElement;
    // this.reviewButton = document.querySelector('#review-button') as HTMLElement;
    // this.seeReviewsButton = document.querySelector('#see-reviews-button') as HTMLElement;
    this.searchBar = document.querySelector('.search-bar') as HTMLElement;
    this.gobackButton = document.querySelector('.goBack') as HTMLElement;
    this.loginButton = document.querySelector('#loginButton_home') as HTMLInputElement;
    this.signUpButton = document.querySelector('#signUpButton_home') as HTMLInputElement;

    this.logOutText = document.querySelector('#logOutText') as HTMLInputElement;
    this.loginText = document.querySelector('#loginText') as HTMLInputElement;
    this.option = document.querySelector('#optionCourse') as HTMLInputElement;

    console.log(document.referrer);
    const lastEntryIndex = window.history.length - 1;
    const lastEntry = window.history.state[lastEntryIndex];
    console.log("last entry " + lastEntry + " " + lastEntryIndex);


    if(this.userName === null){
      console.log("user not logged in")
      this.loginText.style.display="inline";
    }else{
      console.log("user logged in")
      console.log(this.userName);
      this.logOutText.style.display="inline";
    }
    window.addEventListener('beforeunload', function() {
      localStorage.removeItem('selectedClass');
    });

    if(document.referrer!= "http://localhost:4200/"){
      const alreadySelectedClass = localStorage.getItem('selectedClass');

      if(alreadySelectedClass != null){
        this.courseCode = alreadySelectedClass;
        this.selectedClass();
      }
    }
  }

  courseCode='';
  userName: string | null = null;
  courseData : any;
  courseCodes: any[] = [];
  coursesArray: any[] = [];

  //HTML elements
  speachBubble!: HTMLElement;
  // reviewButton!: HTMLElement;
  // seeReviewsButton!: HTMLElement;
  searchBar!: HTMLElement;
  gobackButton!: HTMLElement;
  loginButton!: HTMLElement;
  signUpButton!: HTMLElement;
  logOutText!: HTMLElement;
  loginText!: HTMLInputElement;
  option!:HTMLInputElement; 

  

  //Filtered options from the input
  filteredOptions: string[] = [];
  //The option user selects from the filtered options
  selectedOption: string = '';
getAllCourseData() {
    return new Promise<void>((resolve) => {
      this.httpClient.get('http://127.0.0.1:5000/home').subscribe((data: any) => {
        const allCodes = Object.values(data).map((obj: any) => Object.values(obj)[1]);
        this.courseCodes = allCodes;
        

        console.log(this.courseCodes);

        (document.querySelector('.search-bar') as HTMLElement).style.opacity = '1';
        resolve(); // Resolve the promise once the task is complete
      });});
  }


 /* async getAllCourseData() {
    return new Promise<void>((resolve) => {
      this.httpClient.get('http://127.0.0.1:5002/home').subscribe((data: any) => {
        const allCodes = Object.values(data).map((obj: any) => Object.values(obj)[1]);
        this.courseCodes = allCodes;
        resolve(); // Resolve the promise once the task is complete
      });
    });
  }*/

filterOptions(target: EventTarget | null) {
  if (!(target instanceof HTMLInputElement) || target.value === null) {
    this.filteredOptions = [];
    return;
  }

  const searchValue = target.value.toLowerCase();
  console.log(searchValue + " " + this.courseCodes[0]);
  let matchingCount = 0;

  this.filteredOptions = this.courseCodes.filter(option => {
    const isMatching = option.toLowerCase().startsWith(searchValue);
    if (isMatching) {
      matchingCount++;
    }
    //STOP AFTER 4 OPTIONS TO MAKE SEARCHING FASTER
    return isMatching && matchingCount <= 4;
  });
}

  selectOption(option: string) {
    //When user clicks on the list element puts the clicked item inside the selectedOption
    this.selectedOption = option;
    this.filteredOptions = [];

    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    //Puts the selected element to the search bar 
    searchInput.value = option; 

    //This part is to make the list disappear when the user deletes their input
    searchInput.addEventListener('input', function() {
      const filteredOptionsH = document.querySelector('.filtered-options') as HTMLElement;
      const searchValue = this.value.trim();

      //If the searched value's length is greater than 0 display, else make the list disappear
      if(filteredOptionsH == null){
        return;
      }
      if (searchValue.length > 0) {
        filteredOptionsH.classList.add('block');
      } else {
        filteredOptionsH.classList.remove('none');
      }
    });
  }

  //Checks if the selected option exists in the unique course codes array
  verifySelectedOption(){
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    const input = searchInput.value;
    console.log(input.toUpperCase())
    return this.courseCodes.indexOf(input) > -1;
  }

  //Goes back to the search bar
  goBack(){
    this.changeSpeech("Please select a course");
    // this.reviewButton.style.visibility = "hidden";
    // this.seeReviewsButton.style.visibility = "hidden";
    // this.searchBar.style.visibility = "visible";
    // this.gobackButton.style.visibility = "hidden";

    this.searchBar.style.display ="inline"; 
    this.option.style.display ="none"; 

    localStorage.removeItem('selectedClass');
    (document.querySelector('.search-input') as HTMLInputElement).value = "";
  }


  //Makes two new buttons appear (reviewButton, seeReviewsButton) while making the search bar disappear
  clickButton(){
    //Filters the coursesArray according to selected option
    const selectedOptionValues = this.coursesArray.filter(optionArr => optionArr[1] === this.selectedOption);
    this.courseCode = this.selectedOption;
    console.log(this.selectOption);
    if(this.courseCode === ""){
      this.changeSpeech("Please enter course code");
      return;
    }

    const verificationPassed = this.verifySelectedOption();
    if(verificationPassed){
      this.selectedClass();
      localStorage.setItem('selectedClass', this.courseCode);
    }else{
      this.changeSpeech("Please enter a valid course code");
    }
  }

  //Routes to overview page
  seeReviews(){
    this.router.navigate(['/overview', this.courseCode]);
    window.scrollTo(0, 0);
  }

  //Routes to the review page
  makeReview(){
    if(this.userName === null){
      this.changeSpeech("Please login to make a review");
      this.moveRobot();
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
    // this.loginButton.style.visibility="visible";
    // this.signUpButton.style.visibility="visible";
    this.loginText.style.display ="inline"; 
    this.logOutText.style.display="none";
  }

  changeSpeech(text:string){
    this.speachBubble.innerHTML = text;
  }


  selectedClass(){
    this.changeSpeech("Please select one of the values");
      this.searchBar.style.display = "none";
      this.option.style.display ="inline"; 
      // this.reviewButton.style.visibility = "visible";
      // this.seeReviewsButton.style.visibility = "visible";
      // this.gobackButton.style.visibility = "";

  }

  moveRobot() {
  const robotElement = document.querySelector('.homepage_robot')!;
  robotElement.classList.add('move');

  // Remove the 'move' class after the transition completes
  setTimeout(() => {
    robotElement.classList.remove('move');
  }, 1500); // Adjust the duration (in milliseconds) to control the speed of the movement
}

}
