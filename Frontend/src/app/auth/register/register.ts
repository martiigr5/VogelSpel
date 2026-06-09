import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  username = '';
  email = '';
  password = '';
  role = 'student';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  OnRegister(): void {
    if (!this.username || !this.email || !this.password) {
      this.error = 'Vul alle velden in.';
      return;
    }
    
    this.loading = true;
    this.error = '';

    this.authService.register(this.username, this.email, this.password, this.role).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Registratie mislukt, probeer opnieuw.';
      }
    });
  }
}
