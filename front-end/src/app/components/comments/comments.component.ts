import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {
  @ViewChild('closebtn')
  myButton!: ElementRef;
  @Input() comments: any
  @Input() projectId: any

  commentObject: any

  reportComment: any

  constructor(private commentService: CommentService, private authService: AuthService) { }
  placeholder: String = 'add new comment'
  myform: FormGroup = new FormGroup({
    value: new FormControl('', [Validators.required]),
  });

  get getCommentValue() {
    return this.myform.controls['value'];
  }


  submit(e: Event) {
    e.preventDefault();
    if (this.myform.status == 'VALID') {
      this.commentObject = {
        "project": this.projectId,
        "comment_message": this.getCommentValue.value
      }
      this.commentService.addComment(this.commentObject).subscribe(
        {
          next: (res: any) => {
            this.commentObject.user = this.authService.getLoggedUser.username
            this.commentObject.created_at = new Date()
            this.comments.push(this.commentObject)
            this.myform.controls['value'].setValue('')
            console.log(res);
          },
          error: (err) => {
            console.log(err);
            //     this.errors = err.error;
          },
        });
    } else {
      this.placeholder = 'please provide a comment message first!'
      this.myform.markAllAsTouched();
    }
  }

  reportForm: FormGroup = new FormGroup({
    report_message: new FormControl('', [Validators.required]),
  });

  get getReportValue() {
    return this.reportForm.controls['report_message'];
  }
  setReportComment(comment: any) {
    this.reportComment = comment
  }
  submitReport(e: Event) {
    e.preventDefault();
    if (this.reportForm.status == 'VALID') {

      this.commentService.reportComment(
        {
          "comment": this.reportComment.id,
          "report_message": this.getReportValue.value
        }).subscribe(
          {
            next: (res: any) => {
              this.myButton.nativeElement.click();
              this.reportForm.controls['report_message'].setValue('')
              console.log(res);
            },
            error: (err) => {
              console.log(err);
              //     this.errors = err.error;
            },
          });
    } else {
      // this.placeholder = 'please provide a comment message first!'
      this.myform.markAllAsTouched();
    }
  }
}
