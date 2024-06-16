import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/course';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, switchMap, take, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UserGpa } from 'src/app/models/UserGpa';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit{
 
  course: Course = new Course();
  courses:any[]=[];   //array of available courses

  username: string = '';
  userId: string = '';
  defaultCourse = {courseId: 0, name: 'Select the course from below:', description:"test", type: "RE", credit: 0, grade:0.0};

  selectedCourses:Course[]=[];   //array of selected or saved courses to show in the table
  selectedCourse:any = null;
  public searchInput: String = '';

  grade:string = "A";  
  score: number = 0.0; 
  wgpa:number = 5.0;
  uwgpa:number = 5.0;

  duplicateFlag:Boolean = false;   //warning flag for duplicated courses
  gradeFlag:Boolean = false;       //warning flag for invalid grade
  gpaFlag:Boolean = false;         //hide flag for showing gpa
  courseFlag:Boolean = false;      //warning flag for no course
  isSaveButtonDisabled = true;

  public filteredCourses: any;
  
  constructor(private httpClient: HttpClient, private courseService: CoursesService, private messageService: MessageService) {  
  }

  userGpa:UserGpa = new UserGpa();
   ngOnInit(){
    this.username = sessionStorage.getItem('username') || '';
    console.log("username: ", this.username);
    
    //Read courses collection from json file at Path : assets/resource/courses.json
    this.courseService.getCourses().subscribe(
      (data) => {
        this.courses = data;
        this.filteredCourses = this.courses;
        //console.log(this.filteredCourses);
      }, 
      (error) => {
        console.error('Error reading JSON file:', error);
      }
    );
    if(this.username){
        this.courseService.getSavedCourses(this.username).subscribe(
          (data) => {
            this.selectedCourses = data;
            console.log("Saved Courses" , this.selectedCourses);
          }, 
          (error) => {
            console.error('Error reading JSON file:', error);
          }
        ); 

        this.courseService.getUserGpa(this.username).subscribe(
            (data) => {
              if( data.length > 0){
                this.wgpa = data[0].weightedGpa;
                this.uwgpa = data[0].unWeightedGpa;
                this.gpaFlag = true;
                this.userId = data[0].id;
                console.log( "Saved GPA", this.wgpa , " : ", this.uwgpa);
              }
            }, 
            (error) => {
              console.error('Error reading JSON file:', error);
            }
        );
     }
   }

  onAddCourse(){
    //console.log(this.selectedCourse);
    // Convert the number to a string and use a regular expression to check if it only contains digits
    const numericRegex = /^\d+$/;
    if( !numericRegex.test(this.score.toString()) || this.score>100 || this.score<0 ) {
      this.gradeFlag = true;
    }else if( this.selectedCourse == null){
      this.courseFlag = true;
    }else{
      if( this.selectedCourse !=null ){
        // Check if the course is already in the array
        if(this.selectedCourses.some(course => this.selectedCourse.name === course.name) ){
          this.duplicateFlag = true;
        }else{ 
          this.selectedCourse['score'] = this.score;
          this.selectedCourse['grade'] = this.getGrade(this.score);    //transfer input score to grade
          this.selectedCourses.push(this.selectedCourse);  //add selected new course into the array for the table
          this.duplicateFlag = false;
          this.gradeFlag = false;
          this.courseFlag = false;
        }
      }
    }
    console.log(this.selectedCourses.length);
  }

  onGPA(){   //calculated both weight and unweight gpa after clicking the button
    let sumOfScore = 0.0, uwSumOfScore = 0.0;
    let sumOfCredit = 0.0
    if(this.selectedCourses.length ==0 ){
      this.courseFlag = true;
    }else{
      this.selectedCourses.forEach((course) =>{
        sumOfScore = sumOfScore + course.credit * this.gpaWeight(course.grade, course.type);  // sum for weighted GPA
        uwSumOfScore = uwSumOfScore +  course.credit * this.gpaUnweight(course.grade);    // sum for unweighted GPA
        sumOfCredit = sumOfCredit + course.credit;      //sum of all credits
        console.log(course.name + " : " + course.score + " : " + course.grade 
                                + " : " + this.gpaWeight(course.grade, course.type) + " : " + this.gpaUnweight(course.grade) 
                                + " : "+ uwSumOfScore +  " : " + sumOfScore + " : " + sumOfCredit );
      })
      this.wgpa = sumOfScore/sumOfCredit;  
      this.uwgpa = uwSumOfScore/sumOfCredit; 
      this.gpaFlag = true;
      this.courseFlag = false;
      this.selectedCourse = null;
      this.score  = 0.0;
      this.isSaveButtonDisabled = false;
    }
  }

  onSave(){
    const now = new Date();
    const date = now.toLocaleDateString(); // e.g., "5/29/2024"
    const time = now.toLocaleTimeString(); // e.g., "10:30:00 AM"
    console.log("before save GPA: wgpa=",this.wgpa, "; uwgpa=", this.uwgpa);
    const userGpa = {
      username:this.username,
      date: `${date} ${time}`,
      weightedGpa: this.wgpa,
      unWeightedGpa: this.uwgpa
    };

    this.courseService.saveGpa(userGpa as UserGpa).subscribe(
      response => {
        console.log("After saving GPA , ",response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'GPA saved sucessfully' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong when saving GPA' });
      }
    );

    this.courseService.saveSelectedCourses(this.selectedCourses, this.username).subscribe(
      response => {
        console.log("After saving courses , ",response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Courses GPA saved sucessfully' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }
    );
    this.isSaveButtonDisabled = true;
  }

  getGrade(score:number){   //transfer input score to grade
    let grade = "A";
    switch(true) {
      case score>=90: grade = "A"; break;
      case score>=80 && score<90: grade="B"; break;
      case score>=70 && score<80: grade="C"; break;
      case score>=60 && score<70: grade="D"; break;
      default: grade="E";
    }
    return grade;
  }

  gpaUnweight(grade:string){        //calculate unweight gpa
    let point = 4.0;
    switch(grade) {     
      case "A": point = 4; break;
      case "B": point = 3; break;
      case "C": point = 2; break;
      case "D": point = 1; break;
      default: point = 0;
    }
    return point;
  }

  gpaWeight(grade:string, type:string){
    let qpoint:number = 5;
    switch(grade){
      case "A": 
        switch(type){
          case "AP": qpoint = 5.0; break;
          case "GT": qpoint = 5.0; break;
          case "HO": qpoint = 4.5; break;
          case "RE": qpoint = 4.0; break;
          default:   qpoint = 0.0;
        };
        break;
      case "B":
        switch(type){
          case "AP": qpoint = 4.0; break;
          case "GT": qpoint = 4.0; break;
          case "HO": qpoint = 3.5; break;
          case "RE": qpoint = 3.0; break;
          default:   qpoint = 0.0;
        };
        break;
      case "C":
        switch(type){
          case "AP": qpoint = 3.0; break;
          case "GT": qpoint = 3.0; break;
          case "HO": qpoint = 2.5; break;
          case "RE": qpoint = 2.0; break;
          default:   qpoint = 0.0;
        };
        break;  
      case "D":
        switch(type){
          case "AP": qpoint = 1.0; break;
          case "GT": qpoint = 1.0; break;
          case "HO": qpoint = 1.0; break;
          case "RE": qpoint = 0.0; break;
          default:   qpoint = 0.0;
        };
        break;
      default: qpoint = 0.0;
    }
    return qpoint;
  }

  clear(){    //clear input and restart
    this.selectedCourses = [];
    this.selectedCourse = null;
    this.score  = 0.0;
    this.gpaFlag = false;
    this.courseFlag = false;
    this.gradeFlag = false;
    this.duplicateFlag = false;
  }

  deleteRow(x:number){
    var delBtn = confirm(" Do you want to delete?");
   
    if ( delBtn == true ) {
      this.selectedCourses.splice(x, 1 );
    }
  }

  onKey(e:any){
    //this.selectedCourses = this.search(value);\
    this.filteredCourses = this.search(e.value);
  }

  search(value:string){
    let filter = value.toLowerCase();
    return this.courses.filter(option => option.name.toLowerCase().startsWith(filter));
  }
}
