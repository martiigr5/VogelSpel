import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
    // valideert aan de frontend kant voordat het naar de backend gestuurd wordt
    if (!this.email || !this.password) {
      this.error = 'Vul je e-mail en wachtwoord in.';
      return;
    }

    this.loading = true;
    this.error   = '';

    // authService stuurt een POST naar /api/auth/login
    // subscribe wacht op antwoord van de backend (asychroon)
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.user.role === 'teacher') {
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