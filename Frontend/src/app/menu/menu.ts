import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Header } from "../shared/components/header/header";
import { MenuKnop } from './components/menu-knop/menu-knop';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [Header, MenuKnop],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  newGame(): void {
    this.router.navigate(['/level-select']);
  }

  loadGame(): void {
    this.router.navigate(['/laden']);
  }

  logout(): void {
    this.authService.logout();
  }
}