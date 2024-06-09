import { Component, Input, OnInit } from '@angular/core';
import { User } from './models/user';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
 // title = 'angular-primeng-app';

  
  @Input()
  public title: string = "GPA Calculator";
  @Input()
  public isUserLoggedIn: boolean = false;

  user?: User | null;

  constructor(private router: Router, private userService:UserService){ 
    //console.log('test!');
  }

  ngOnInit(): void{ }

  onHome(){    
    console.log('home page');
    this.router.navigate(['home']);
  }

  onLogin(){    
    console.log('Login page');
    this.router.navigate(['login']);
  }

  onCourse(){
    console.log('course page')
    this.router.navigate(['course']);
  }

  logout() {
    this.userService.logout();
  }
}
