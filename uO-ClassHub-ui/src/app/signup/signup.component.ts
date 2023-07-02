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
	}
	signUp(){
		const userName= this.signupForm.get('fullname')?.value;
		const userEmail = this.signupForm.get('email')?.value;
		const userPassword = this.signupForm.get('password')?.value;
		console.log(userName);

		if(userName === '' || userEmail ==='' || userPassword ===''){
			alert("Please fill all values");
			return;
		}
		if(!this.validEmail(userEmail)){
			alert("Enter valid email");
			return;
		}
		this.http.post<any>("http://localhost:3000/signupUsers", this.signupForm.value)
		.subscribe(res=>{
			this.signupForm.reset();
			this.router.navigate(['login']);
			window.scrollTo(0, 0);
		},err=>{
			alert("Error occured")
		})
	}

	validEmail(email:string):boolean{
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email) 

	}

}
