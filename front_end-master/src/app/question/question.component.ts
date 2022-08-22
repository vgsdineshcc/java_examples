import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionserviceService } from '../service/questionservice.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  @ViewChild('name') nameKey!:ElementRef;
  public name: string=""; progress:string="0";
  isQuizCompleted:boolean=false;
  public questionList:any=[];
  public currentQuestion:number=0;
  public points:number=0;
  public counter:number=60;
  public correctAnswerCount=0;
  public incorrectAnswerCount=0;
  interval$:any;
  constructor(private questionService :QuestionserviceService) { }

  ngOnInit(): void {
    this.name=localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionJson().subscribe(res=>{this.questionList=res.AllQuestions});
  }
  
  nextQuestion(){
    this.currentQuestion+=1;
  }
  previousQuestion(){
    this.currentQuestion-=1;
  }
  answer(currentQuestionNo:number,option:any){
    if(currentQuestionNo===this.questionList.length){
      this.isQuizCompleted=true;
      this.stopCounter();
    }
    if(option.correct){
      this.points+=10;
      this.correctAnswerCount++;
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
      

    }else{
      setTimeout(() => {
        this.currentQuestion++;
        this.incorrectAnswerCount++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
      this.points-=10;
    }
  }
  startCounter(){
    this.interval$=interval(1000).subscribe (val=>{this.counter--;if(this.counter===0){this.currentQuestion++;this.counter=60;this.points-=10;}})
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }
  
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
    this.progress="0";
  }
  getProgressPercent(){
    this.progress=((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }

}
