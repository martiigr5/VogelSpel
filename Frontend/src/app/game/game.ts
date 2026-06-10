import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { GameService } from "../shared/services/game";
import { ProgressService } from "../shared/services/progress";
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game implements OnInit {
  levels: any[] = [];
  currentLevel: any = null;
  currentSession: any = null;
  loading = true;
  error = '';

  constructor(
    private gameService: GameService,
    private progressService: ProgressService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameService.getLevels().subscribe({
      next:(levels) => {
        this.levels = levels;
        this.loading = false;
        console.log('levels:', this.levels);
      },
      error: (err) => {
        this.error = 'Kon levels niet ophalen.';
        this.loading = false;
        console.log('error:', err);
      }
    });
  }

  startLevel(level: any): void {
    this.loading = true;
    this.progressService.startSession(level.id).subscribe({
      next: (session) => {
        this.currentSession = session;
        this.gameService.getLevel(level.id).subscribe({
          next: (levelData) => {
            this.currentLevel = levelData;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Kon Level niet starten';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}