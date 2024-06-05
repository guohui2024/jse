import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void{ 
    console.log('Current route snapshot:', this.activatedRoute.snapshot);
  }
}

