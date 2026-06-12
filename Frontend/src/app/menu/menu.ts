import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { using } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  gebruikersnaam = '';
  klas = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const u = user as any;
        this.gebruikersnaam = `${u.voornaam} ${u.achternaam}`;
        this.klas = u.klas || '';
      }
    })
  }

  newGame(): void {
    this.router.navigate(['/game']);
  }

  loadGame(): void {
  this.router.navigate(['/laden']);
  }

  logout(): void {
    this.authService.logout();
  }
}