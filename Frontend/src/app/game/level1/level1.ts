import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: 'app-level1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './level1.html',
  styleUrl: './level1.scss'
})
export class Level1 implements OnInit {
  items = signal<any[]>([]);
  currentKlank = signal('aa');
  gevonden = signal<number[]>([]);
  feedback = signal('');
  feedbackType = signal('');
  score = signal(0);
  levelKlaar = signal(false);
  loading = signal(true);

  //(later uitbreiden)
  klanken = ['aa', 'oe', 'ie']
  huidigeKlankIndex = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/game/levels/1').subscribe({
      next: (data) => {
        this.items.set(data.items);
        this.loading.set(false);
        this.toonKlank();
      },
      error: () => this.loading.set(false)
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
    if (item.klank === this.currentKlank()) {
      this.gevonden.set([...this.gevonden(), item.id]);
      this.score.set(this.score() + 1);
      this.feedback.set(`Ja "${item.name}" heeft de klank "${this.currentKlank().toUpperCase()}"!`);
      this.feedbackType.set('Goed');

      if (this.alleGevonden) {
        setTimeout(() => this.volgendeKlank(), 1500);
      }
    } else {
      this.feedback.set(`Nee, "${item.name}" heeft niet de klank "${this.currentKlank().toUpperCase()}"!`);
      this.feedbackType.set('Fout');
    }
  }

  volgendeKlank(): void {
    if (this.huidigeKlankIndex < this.klanken.length - 1) {
      this.huidigeKlankIndex++;
      this.toonKlank();
    } else {
      this.levelKlaar.set(true);
      this.feedback.set('Level voltooid! Goed gedaan!');
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