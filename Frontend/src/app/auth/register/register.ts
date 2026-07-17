import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterRequest } from '../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  voornaam  = '';
  achternaam = '';
  klas = '';
  email     = '';
  password  = '';
  role: 'student' | 'teacher' = 'student';
  error     = '';
  loading   = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    // validatie frontend
    if (!this.voornaam || !this.achternaam || !this.email || !this.password) {
      this.error = 'Vul alle velden in.';
      return;
    }

    this.loading = true;
    this.error   = '';

    const request: RegisterRequest = {
      voornaam: this.voornaam, 
      achternaam: this.achternaam,
      email: this.email,
      password: this.password, 
      role: this.role,
      klas: this.klas
    };
    this.authService.register(request).subscribe({
      next:() => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message ?? 'Er is een fout opgetreden.';
        
      }
    });
  }
}