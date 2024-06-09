import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router){ 
    //console.log('test!');
  }

  ngOnInit(): void{ }
  
  onHome(){    
    console.log('home page');
    this.router.navigate(['home']);
  }

  onCourse(){
    console.log('course page')
    this.router.navigate(['course']);
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

}
