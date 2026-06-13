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
  levels         = signal<any[]>([]);
  loading        = signal(true);
  error          = signal('');
  gebruikersnaam = '';
  klas           = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private progressService: ProgressService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const u = user as any;
        this.gebruikersnaam = `${u.voornaam} ${u.achternaam}`;
        this.klas = u.klas || '';
      }
    });

  this.http.get<any[]>('http://localhost:3000/api/game/levels').subscribe({
    next: (levels) => {
      this.levels.set(levels);
      this.loading.set(false);
    },
    error: () => {
      this.error.set('Kon levels niet ophalen.');
      this.loading.set(false);
    }
  });
  }

  getLevelNaam(level: any): string {
    const namen: any = {
      1: 'Beginner',
      2: 'Gemiddeld',
      3: 'Moeilijk',
      4: 'Toets'
    };
    return namen[level.level_number] || level.title;
  }

  startLevel(level: any): void {
    if (level.level_number === 1) {
      this.router.navigate(['/game/level1'], { queryParams: { nieuw: true } });
    }
  }

  terugNaarMenu(): void {
    this.router.navigate(['/menu']);
  }
}