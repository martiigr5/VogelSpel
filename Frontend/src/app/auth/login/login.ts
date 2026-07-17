import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LoginResponse } from '../../shared/models/user.model';
import { Role } from '../../shared/models/role.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email    = '';
  password = '';
  error    = '';
  loading  = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.error = 'Vul je e-mail en wachtwoord in.';
      return;
    }

    this.loading = true;
    this.error   = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: LoginResponse) => {
        this.loading = false;
        if (response.user.role === Role.Teacher) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/menu']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Inloggen mislukt. Probeer opnieuw.';
      }
    });
  }
}