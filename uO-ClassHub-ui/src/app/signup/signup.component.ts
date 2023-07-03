import { Component } from '@angular/core';
import {FormGroup, FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
	public signupForm! : FormGroup;
	constructor(private formBuilder: FormBuilder, private http: HttpClient, private router:Router){

	}
	ngOnInit():void{
		this.signupForm = this.formBuilder.group({
			fullname:[''],
			email:[''],
			password:['']
		})
		localStorage.setItem('signUp', 'signedUp');
	}
	signUp(){
		const userName= this.signupForm.get('fullname')?.value;
		const userEmail = this.signupForm.get('email')?.value;
		const userPassword = this.signupForm.get('password')?.value;
		console.log(userName);

		if(userName === '' || userEmail ==='' || userPassword ===''){
			this.showAlert("Please fill all values");
			return;
		}
		if(!this.validEmail(userEmail)){
			this.showAlert("Enter valid email");
			return;
		}

		this.http.get<any>("http://localhost:3000/signupUsers")
		.subscribe(res =>{
			const user = res.find((a:any) =>{
				return a.email === userEmail;
			});
			if(user){
				this.showAlert("A user with this email already exists");
				//alert("A user with this email already exists");
				return;
			}else{
				this.signupUser();
			}
		},err=>{
			alert("Something went wrong");
		})

	}

	validEmail(email:string):boolean{
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email) 

	}
	signupUser(){
		this.http.post<any>("http://localhost:3000/signupUsers", this.signupForm.value)
		.subscribe(res=>{
			this.signupForm.reset();
			this.router.navigate(['login']);
			window.scrollTo(0, 0);
		},err=>{
			alert("Error occured")
		})
	}
	showAlert(text: string) {
	  var alertBox = document.getElementById("alertBox")!;
	  alertBox!.innerHTML = text;
	  alertBox.style.display = "block";

	setTimeout(function() {
	    alertBox.style.opacity = "1";
	  }, 10); // Delay the opacity transition for a smoother effect

	  setTimeout(function() {
	    alertBox.style.opacity = "0";
	    setTimeout(function() {
	      alertBox.style.display = "none";
	    }, 300);
	  }, 2000);
	}

}
