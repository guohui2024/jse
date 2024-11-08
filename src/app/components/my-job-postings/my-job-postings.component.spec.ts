import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJobPostingsComponent } from './my-job-postings.component';

describe('MyJobPostingsComponent', () => {
  let component: MyJobPostingsComponent;
  let fixture: ComponentFixture<MyJobPostingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyJobPostingsComponent]
    });
    fixture = TestBed.createComponent(MyJobPostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
