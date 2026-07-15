import { Component, OnInit, signal, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";
import { Header } from "../../shared/components/header/header";
import { Scene } from "./components/scene/scene";
import { KlankBanner } from "./components/klank-banner/klank-banner";
import { GameFooter } from "./components/game-footer/game-footer";
import { LevelKlaar } from "./components/level-klaar/level-klaar";

@Component({
  selector: 'app-level1',
  standalone: true,
  imports: [Header, Scene, KlankBanner, GameFooter, LevelKlaar],
  templateUrl: './level1.html',
  styleUrl: './level1.scss'
})
export class Level1 implements OnInit {
  @ViewChild(KlankBanner) klankBanner!: KlankBanner;

  items      = signal<any[]>([]);
  gevonden   = signal<Set<number>>(new Set());
  loading    = signal(true);
  levelKlaar = signal(false);
  score      = signal(0);

  gebruikersnaam = '';
  klas           = '';
  sessionId      = 0;
  sceneImage     = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const u = user as any;
        this.gebruikersnaam = `${u.voornaam} ${u.achternaam}`;
        this.klas = u.klas || '';
      }
    });

    const isNieuw = this.route.snapshot.queryParams['nieuw'] === 'true';
    this.startSessie(!isNieuw);
  }

  startSessie(herstelVoortgang: boolean): void {
    this.http.post<any>('http://localhost:3000/api/progress/session', { level_id: 1 }).subscribe({
      next: (sessie) => {
        this.sessionId = sessie.id;
        this.laadLevel();
      },
      error: () => this.laadLevel()
    });
  }

  laadLevel(): void {
    this.http.get<any>('http://localhost:3000/api/game/levels/1').subscribe({
      next: (data) => {
        this.items.set(data.items);
        this.sceneImage = data.level.scene_image || '';
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onItemGeklikt(item: any): void {
    this.klankBanner.verwerkKlik(item);
  }

  onGevondenGewijzigd(gevonden: Set<number>): void {
    this.gevonden.set(new Set(gevonden));
  }

  onItemVerwerkt(event: { item: any; isGoed: boolean }): void {
    if (event.isGoed) {
      this.score.set(this.score() + 1);
    }
    if (this.sessionId) {
      this.http.post('http://localhost:3000/api/progress/answer', {
        session_id:     this.sessionId,
        assignment_id:  event.item.id,
        is_correct:     event.isGoed,
        student_answer: event.item.name
      }).subscribe();
    }
  }

  onLevelVoltooid(): void {
    if (this.sessionId) {
      this.http.post('http://localhost:3000/api/progress/complete', { session_id: this.sessionId }).subscribe();
    }
    this.levelKlaar.set(true);
  }

  terugNaarMenu(): void {
    this.router.navigate(['/menu']);
  }
}