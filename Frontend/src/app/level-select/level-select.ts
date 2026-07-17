import { Component, OnInit, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Header } from "../shared/components/header/header";
import { LevelKaart } from "./components/level-kaart/level-kaart";
import { Level } from "../shared/models/game.model";

@Component({
  selector: 'app-level-select',
  standalone: true,
  imports: [Header, LevelKaart],
  templateUrl: './level-select.html',
  styleUrl: './level-select.scss'
})
export class LevelSelect implements OnInit {
  levels         = signal<Level[]>([]);
  loading        = signal(true);
  error          = signal('');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<Level[]>('http://localhost:3000/api/game/levels').subscribe({
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

  getLevelNaam(level: Level): string {
    const namen: Record<number, string> = {
      1: 'Beginner',
      2: 'Gemiddeld',
      3: 'Moeilijk',
      4: 'Toets'
    };
    return namen[level.level_number] || level.title;
  }

  isUitgeschakeld(level: Level): boolean {
    return level.level_number > 1;
  }

  onLevelGeklikt(level: Level): void {
    if (level.level_number === 1) {
      this.router.navigate(['/level-select/level1'], { queryParams:{nieuw: true} });
    }
  }

  terugNaarMenu(): void {
    this.router.navigate(['/menu']);
  }
}