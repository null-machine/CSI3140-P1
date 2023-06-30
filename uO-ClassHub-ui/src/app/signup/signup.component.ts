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
		this.http.post<any>("http://localhost:3000/signupUsers", this.signupForm.value)
		.subscribe(res=>{
			this.signupForm.reset();
			this.router.navigate(['login']);
		},err=>{
			alert("Error occured")
		})
	}

}
