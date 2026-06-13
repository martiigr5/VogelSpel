import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-laden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './laden.html',
  styleUrl: './laden.scss'
})
export class Laden implements OnInit {
  sessies        = signal<any[]>([]);
  loading        = signal(true);
  gebruikersnaam = '';
  klas           = '';

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

    this.http.get<any[]>('http://localhost:3000/api/progress/me').subscribe({
      next: (data) => {
        this.sessies.set(data.filter(s => !s.completed));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  laadSessie(sessie: any): void {
    if (sessie.level_number === 1) {
      this.router.navigate(['/game/level1']);
    }
  }

  verwijderSessie(sessie: any, event: Event): void {
    event.stopPropagation();
    this.http.delete(`http://localhost:3000/api/progress/session/${sessie.id}`).subscribe({
      next: () => {
        this.sessies.set(this.sessies().filter(s => s.id !== sessie.id));
      }
    });
  }

  formatDatum(datum: string): string {
    if (!datum) return '';
      const d = new Date(datum);
      const nu = new Date();
      const diff = nu.getTime() - d.getTime();
      const uren = Math.floor(diff / 3600000);
      if (uren < 24) return `vandaag ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  getVoortgang(sessie: any): number {
    const answered = Number(sessie.answered || 0);
    const totaal   = 12;
    return Math.min(Math.round((answered / totaal) * 100), 100);
  }

  terugNaarMenu(): void {
    this.router.navigate(['/menu']);
  }
}