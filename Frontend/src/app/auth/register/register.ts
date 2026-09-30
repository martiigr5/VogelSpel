import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterRequest } from '../../shared/models/user.model';
import { Role } from '../../shared/models/role.enum';
import { RegisterForm, RegisterFormData } from './components/register-form/register-form';
import { LogoFront } from '../components/logo-front/logo-front';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RegisterForm, LogoFront],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  error     = '';
  loading   = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(data: RegisterFormData): void {
    // validatie frontend
    if (!data.voornaam || !data.achternaam || !data.email || !data.password) {
      this.error = 'Vul alle velden in.';
      return;
    }

    this.loading = true;
    this.error   = '';

    const request: RegisterRequest = {
      voornaam: data.voornaam, 
      achternaam: data.achternaam,
      email: data.email,
      password: data.password, 
      role: data.role,
      klas: data.klas
    };
    this.authService.register(request).subscribe({
      next:() => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message ?? 'Registratie mislukt. Probeer opnieuw.';
        
      }
    });
  }
}