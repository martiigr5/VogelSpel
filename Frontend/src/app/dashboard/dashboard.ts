import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { StudentProgress, DashboardStats } from '../shared/models/process.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  stats = signal<DashboardStats>({
    actieveLeerlingen:   0,
    gemiddeldeVoortgang: 0,
    lopenAchter:         0,
    levelsVoltooid:      0
  });
  meldingen = signal<StudentProgress[]>([]);
  loading   = signal(true);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<StudentProgress[]>('http://localhost:3000/api/progress/students').subscribe({
      next: (data) => {
        const uniekeStudenten = [...new Set(data.map(d => d.id))];
        const voltooid        = data.filter(d => d.completed).length;
        const totaalAnswered  = data.reduce((sum, d) => sum + Number(d.answered || 0), 0);
        const totaalCorrect   = data.reduce((sum, d) => sum + Number(d.correct  || 0), 0);
        const gemiddeld       = totaalAnswered > 0 ? Math.round((totaalCorrect / totaalAnswered) * 100) : 0;

        this.stats.set({
          actieveLeerlingen:   uniekeStudenten.length,
          gemiddeldeVoortgang: gemiddeld,
          lopenAchter:         uniekeStudenten.length - voltooid,
          levelsVoltooid:      voltooid
        });

        this.meldingen.set(
          data
            .filter(d => d.last_active)
            .sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime())
            .slice(0, 5)
        );

        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  formatDatum(datum: string): string {
    if (!datum) return '';
    const d       = new Date(datum);
    const nu      = new Date();
    const diff    = nu.getTime() - d.getTime();
    const minuten = Math.floor(diff / 60000);
    const uren    = Math.floor(diff / 3600000);
    const dagen   = Math.floor(diff / 86400000);
    if (minuten < 60) return `${minuten} minuten geleden`;
    if (uren    < 24) return `${uren} uur geleden`;
    return `${dagen} dagen geleden`;
  }

  bekijkLeerling(id: number): void {
    this.router.navigate(['/dashboard/leerlingen'], { queryParams: { id } });
  }
}