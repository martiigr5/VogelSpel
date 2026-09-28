import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LoginResponse } from '../../shared/models/user.model';
import { LoginForm } from './components/login-form/login-form';
import { LogoFront } from '../components/logo-front/logo-front';
import { Role } from '../../shared/models/role.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginForm, LogoFront],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  error    = '';
  loading  = false;

  constructor(private authService: AuthService, private router: Router) {}

  onInloggen(event: { email: string; password: string }): void {
    if (!event.email || !event.password) {
      this.error = 'Vul je e-mail en wachtwoord in.';
      return;
    }

    this.loading = true;
    this.error   = '';

    this.authService.login(event.email, event.password).subscribe({
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