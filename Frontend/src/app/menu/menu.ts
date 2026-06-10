import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  newGame(): void {
    this.router.navigate(['/game']);
  }

  loadGame(): void {
    // later gevult met de saved games
    this.router.navigate(['/game']);
  }

  logout(): void {
    this.authService.logout();
  }
}