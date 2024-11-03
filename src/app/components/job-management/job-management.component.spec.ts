import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobManagementComponent } from './job-management.component';

describe('JobManagementComponent', () => {
  let component: JobManagementComponent;
  let fixture: ComponentFixture<JobManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobManagementComponent]
    });
    fixture = TestBed.createComponent(JobManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
