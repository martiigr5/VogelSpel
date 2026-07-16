import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() toonTerug = true;
  @Input() toonUitloggen = false;

  @Output() terugGeklikt = new EventEmitter<void>();
  @Output() uitloggenGeklikt = new EventEmitter<void>();

  gebruikersnaam = '';
  klas = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const u = user as any;
        this.gebruikersnaam = `${u.voornaam} ${u.achternaam}`;
        this.klas = u.klas || '';
      }
    });
  }

  onTerug(): void {
    this.terugGeklikt.emit();
  }

  onUitloggen(): void {
    this.uitloggenGeklikt.emit()
  }
}
