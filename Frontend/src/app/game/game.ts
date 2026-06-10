import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";
import { ProgressService } from "../shared/services/progress";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game implements OnInit {
  levels   = signal<any[]>([]);
  loading  = signal(true);
  error    = signal('');
  currentLevel   = signal<any>(null);
  currentSession = signal<any>(null);

  constructor(
    private http: HttpClient,
    private progressService: ProgressService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/game/levels').subscribe({
      next: (data) => {
        this.levels.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Kon levels niet ophalen.');
        this.loading.set(false);
      }
    });
  }

  startLevel(level: any): void {
    this.loading.set(true);
    this.progressService.startSession(level.id).subscribe({
      next: (session) => {
        this.currentSession.set(session);
        this.http.get<any>(`http://localhost:3000/api/game/levels/${level.id}`).subscribe({
          next: (levelData) => {
            this.currentLevel.set(levelData);
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.error.set('Kon level niet starten.');
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}