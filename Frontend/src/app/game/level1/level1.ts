import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-level1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './level1.html',
  styleUrl: './level1.scss'
})
export class Level1 implements OnInit {
  items          = signal<any[]>([]);
  currentKlank   = signal('aa');
  gevonden       = signal<number[]>([]);
  feedback       = signal('');
  feedbackType   = signal('');
  score          = signal(0);
  levelKlaar     = signal(false);
  loading        = signal(true);
  gebruikersnaam = '';
  klas           = '';
  sessionId      = 0;

  klanken = ['aa', 'oe', 'ie'];
  huidigeKlankIndex = 0;

  constructor(
    private http: HttpClient,
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
    });

    // Start of hervat sessie
    this.http.post<any>('http://localhost:3000/api/progress/session', { level_id: 1 }).subscribe({
      next: (sessie) => {
        this.sessionId = sessie.id;

        // Haal voortgang op van bestaande sessie
        this.http.get<any[]>('http://localhost:3000/api/progress/me').subscribe({
          next: (progressData) => {
            const mijnSessie = progressData.find(s => s.level_id === 1);
            if (mijnSessie && mijnSessie.answered > 0) {
              // Herstel voortgang — hoeveel klanken al gedaan
              const aantalKlankenGedaan = Math.floor(Number(mijnSessie.correct) / 4);
              this.huidigeKlankIndex = Math.min(aantalKlankenGedaan, this.klanken.length - 1);
              this.score.set(Number(mijnSessie.correct));
            }

            // Laad level data
            this.http.get<any>('http://localhost:3000/api/game/levels/1').subscribe({
              next: (data) => {
                this.items.set(data.items);
                this.loading.set(false);
                this.toonKlank();
              },
              error: () => this.loading.set(false)
            });
          },
          error: () => {
            // Geen voortgang, gewoon starten
            this.http.get<any>('http://localhost:3000/api/game/levels/1').subscribe({
              next: (data) => {
                this.items.set(data.items);
                this.loading.set(false);
                this.toonKlank();
              },
              error: () => this.loading.set(false)
            });
          }
        });
      },
      error: () => {
        // Sessie mislukt, toch level laden
        this.http.get<any>('http://localhost:3000/api/game/levels/1').subscribe({
          next: (data) => {
            this.items.set(data.items);
            this.loading.set(false);
            this.toonKlank();
          },
          error: () => this.loading.set(false)
        });
      }
    });
  }

  toonKlank(): void {
    this.currentKlank.set(this.klanken[this.huidigeKlankIndex]);
    this.gevonden.set([]);
    this.feedback.set(`Klik op alle voorwerpen met de klank "${this.klanken[this.huidigeKlankIndex].toUpperCase()}"!`);
    this.feedbackType.set('info');
  }

  get correctItems(): any[] {
    return this.items().filter(item => item.klank === this.currentKlank());
  }

  get alleGevonden(): boolean {
    return this.correctItems.every(item => this.gevonden().includes(item.id));
  }

  klikItem(item: any): void {
    if (this.gevonden().includes(item.id)) return;

    const isGoed = item.klank === this.currentKlank();

    // Sla antwoord op in database
    if (this.sessionId) {
      this.http.post('http://localhost:3000/api/progress/answer', {
        session_id:    this.sessionId,
        assignment_id: item.id,
        is_correct:    isGoed,
        student_answer: item.name
      }).subscribe();
    }

    if (isGoed) {
      this.gevonden.set([...this.gevonden(), item.id]);
      this.score.set(this.score() + 1);
      this.feedback.set(`✅ Ja! "${item.name}" heeft de klank "${this.currentKlank().toUpperCase()}"!`);
      this.feedbackType.set('Goed');

      if (this.alleGevonden) {
        setTimeout(() => this.volgendeKlank(), 1500);
      }
    } else {
      this.feedback.set(`❌ Nee, "${item.name}" heeft niet de klank "${this.currentKlank().toUpperCase()}".`);
      this.feedbackType.set('Fout');
    }
  }

  volgendeKlank(): void {
    if (this.huidigeKlankIndex < this.klanken.length - 1) {
      this.huidigeKlankIndex++;
      this.toonKlank();
    } else {
      // Level voltooid — markeer sessie als compleet
      if (this.sessionId) {
  this.http.post('http://localhost:3000/api/progress/complete', { session_id: this.sessionId }).subscribe();
}
      this.levelKlaar.set(true);
      this.feedback.set('🎉 Level voltooid! Goed gedaan!');
      this.feedbackType.set('Goed');
    }
  }

  isGevonden(item: any): boolean {
    return this.gevonden().includes(item.id);
  }

  terugNaarMenu(): void {
    this.router.navigate(['/menu']);
  }
}