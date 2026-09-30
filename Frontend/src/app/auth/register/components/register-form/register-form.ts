import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Role } from '../../../../shared/models/role.enum';

export interface RegisterFormData {
  voornaam: string;
  achternaam: string; 
  klas: string;
  email: string;
  password: string;
  role: Role;
}

@Component({
  selector: 'app-register-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  @Input() error = '';
  @Input() loading = false;

  @Output() registreren = new EventEmitter<RegisterFormData>();

  voornaam = '';
  achternaam = '';
  klas = '';
  email = '';
  password = '';
  role = Role.Student;

  Role = Role;

  onRegister(): void {
    this.registreren.emit({
      voornaam: this.voornaam,
      achternaam: this.achternaam,
      klas: this.klas,
      email: this.email,
      password: this.password,
      role: this.role
    });
  }
}
