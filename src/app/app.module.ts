import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobApplyComponent } from './components/job-apply/job-apply.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { JobManagementComponent } from './components/job-management/job-management.component';
import { JobPostingComponent } from './components/job-posting/job-posting.component';
import { UserRoleAssignmentComponent } from './components/user-role-assignment/user-role-assignment.component';
import { AddEmployerComponent } from './components/add-employer/add-employer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    JobListComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    JobListComponent,
    JobApplyComponent,
    ConfirmationModalComponent,
    AddEmployerComponent,
    UserRoleAssignmentComponent,
    JobManagementComponent,
    JobPostingComponent,
    UserRoleAssignmentComponent,
    AddEmployerComponent
    //NgModule // Import NgbModule instead of NgbModalModule
  ],
  imports: [
    BrowserModule,
    NgbModalModule,
    FormsModule,
    AppRoutingModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    ButtonModule,
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule, // Add other Material modules as needed
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
