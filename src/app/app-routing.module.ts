import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { FooterComponent } from './components/footer/footer.component';
import { CourseComponent } from './components/course/course.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  { path: 'login',    component: LoginComponent  },
  { path: 'register', component: RegisterComponent },
  { path: 'home',     component: HomeComponent, canActivate: [authGuard] },
  { path: 'footer',   component: FooterComponent, canActivate: [authGuard] },
  { path: 'course',   component: CourseComponent, canActivate: [authGuard] },
  { path: 'header',   component: HeaderComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
