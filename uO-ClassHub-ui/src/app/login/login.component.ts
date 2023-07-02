import { Component } from '@angular/core';
import {FormGroup, FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	public loginForm! : FormGroup;
	constructor(private formBuilder: FormBuilder, private http:HttpClient, private router:Router,private location: Location){

	}
	ngOnInit():void{
		this.loginForm = this.formBuilder.group({
			email:[''],
			password:['']
		})
	}
	login(){
		//get all users in the signupUsers database
		this.http.get<any>("http://localhost:3000/signupUsers")
		.subscribe(res =>{
			const user = res.find((a:any) =>{
				console.log(this.loginForm.value.password);
				return a.email === this.loginForm.value.email && a.password === this.loginForm.value.password;
			});
			if(user){
				this.loginForm.reset();
				localStorage.setItem('userName', user.fullname);
				//console.log(user)
				//console.log(user.fullname)
				this.location.back();
				window.scrollTo(0, 0);
			}else{
				alert("user not found");
			}
		},err=>{
			alert("Something went wrong");
		})

	}

}
