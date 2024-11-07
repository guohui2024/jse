import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobApplyComponent } from './components/job-apply/job-apply.component';
import { JobManagementComponent } from './components/job-management/job-management.component';
import { AdminGuard } from './guards/admin.guard';
import { EmployerGuard } from './guards/employer.guard';
import { JobPostingComponent } from './components/job-posting/job-posting.component';
import { UserRoleAssignmentComponent } from './components/user-role-assignment/user-role-assignment.component';
import { AddEmployerComponent } from './components/add-employer/add-employer.component';

const routes: Routes = [
  { path: 'login',    component: LoginComponent  },
  { path: 'jobmanagement', component: JobManagementComponent, canActivate: [AdminGuard]},  //
  { path: 'userroleassignment', component: UserRoleAssignmentComponent, canActivate: [AdminGuard]}, 
  { path: 'addemployer', component: AddEmployerComponent, canActivate: [AdminGuard]}, 
  { path: 'jobposting', component: JobPostingComponent, canActivate: [EmployerGuard]  }, //, canActivate: [EmployerGuard] 
  { path: 'register', component: RegisterComponent },
  { path: 'joblist',     component: JobListComponent },
  { path: 'jobapply',     component: JobApplyComponent },
  { path: '', redirectTo: '/joblist', pathMatch: 'full' },
  { path: '**', redirectTo: '/joblist' }, // Redirect to job list for unmatched routes
  { path: 'footer',   component: FooterComponent, canActivate: [authGuard] },
  { path: 'header',   component: HeaderComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'joblist', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
