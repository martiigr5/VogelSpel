import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";
import { Header } from "../shared/components/header/header";
import { LevelKaart } from "./components/level-kaart/level-kaart";

@Component({
  selector: 'app-level-select',
  standalone: true,
  imports: [CommonModule, Header, LevelKaart],
  templateUrl: './level-select.html',
  styleUrl: './level-select.scss'
})
export class LevelSelect implements OnInit {
  levels         = signal<any[]>([]);
  loading        = signal(true);
  error          = signal('');

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  isUitgeschakeld(level: any): boolean {
    return level.level_number > 1;
  }

  onLevelGeklikt(level: any): void {
    if (level.level_number === 1) {
      this.router.navigate(['/level-select/level1'], { queryParams:{nieuw: true} });
    }
  }

  terugNaarMenu(): void {
    this.router.navigate(['/menu']);
  }
}