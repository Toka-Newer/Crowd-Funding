import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {
  errors: any;
  code: string;
  email: string;
  private timeoutId: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.code = String(this.activatedRoute.snapshot.paramMap.get('code'));
    this.email = String(this.activatedRoute.snapshot.paramMap.get('email'));
  }

  ngOnInit() {
    this.submit();

    // Set a timeout to navigate after one minute (60000 milliseconds)
    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }

  ngOnDestroy() {
    // Clear the timeout when the component is destroyed
    clearTimeout(this.timeoutId);
  }

  submit() {
    this.auth.confirm(this.email, this.code).subscribe({
      next: (res: any) => {
        console.log("Response: ", res);
        this.auth.loggedUser = res.user;
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        // Navigate immediately after successful confirmation
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
        this.errors = err.error;
      },
    });
  }
}
