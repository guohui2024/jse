import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleAssignmentComponent } from './user-role-assignment.component';

describe('UserRoleAssignmentComponent', () => {
  let component: UserRoleAssignmentComponent;
  let fixture: ComponentFixture<UserRoleAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRoleAssignmentComponent]
    });
    fixture = TestBed.createComponent(UserRoleAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
