import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule,HttpClientTestingModule], // Include both RouterTestingModule and HttpClientTestingModule
      declarations: [SignupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
    it('should create the SignupComponent', () => {
    expect(component).toBeTruthy();
  });

    it('should initialize the signupForm with empty values', () => {
    expect(component.signupForm.get('fullname')?.value).toBe('');
    expect(component.signupForm.get('email')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
  });
  it('should set localStorage item "signUp" to "signedUp" on ngOnInit', () => {
    spyOn(localStorage, 'setItem');
    component.ngOnInit();
    expect(localStorage.setItem).toHaveBeenCalledWith('signUp', 'signedUp');
  });

});
