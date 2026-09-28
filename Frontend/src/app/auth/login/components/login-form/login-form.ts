import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {

  @Input() error = '';
  @Input() loading = false;

  @Output() inloggen = new EventEmitter<{ email: string; password: string }>();

  email = '';
  password = '';

  onLogin(): void {
    this.inloggen.emit({ email: this.email, password: this.password });
  }
}
