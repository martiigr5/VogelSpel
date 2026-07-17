import { Component,Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  @Output() terugGeklikt     = new EventEmitter<void>();
  @Output() uitloggenGeklikt = new EventEmitter<void>();

  @Input() toonTerug     = true;
  @Input() toonUitloggen = false;

  gebruikersnaam = '';
  klas           = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        this.gebruikersnaam = `${user.voornaam} ${user.achternaam}`;
        this.klas = user.klas || '';
      }
    });
  }

  onTerug(): void {
    this.terugGeklikt.emit();
  }

  onUitloggen(): void {
    this.uitloggenGeklikt.emit();
  }
}