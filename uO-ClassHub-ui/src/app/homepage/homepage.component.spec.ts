import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomepageComponent } from './homepage.component';
import { Router } from '@angular/router';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule],
      declarations: [HomepageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // Spy on the router.navigate method
    spyOn(window, 'scrollTo'); // Spy on the window.scrollTo function
    fixture.detectChanges();
  });

  it('should navigate to overview page and scroll to top when seeReviews is called', () => {
    // Set a course code
    const courseCode = 'CSI 2101 Discrete Structures (3 units)';
    component.courseCode = courseCode;

    component.seeReviews();
    expect(router.navigate).toHaveBeenCalledWith(['/overview', courseCode]);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
    it('should initialize properties correctly', () => {
    expect(component.userName).toBeNull();
    expect(component.courseCode).toBe('');
  });

  it('should call loadHomePage method during component initialization', () => {
    spyOn(component, 'loadHomePage');
    component.ngOnInit();
    expect(component.loadHomePage).toHaveBeenCalled();
  });

});




