import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Sidebar } from '../sidebar/sidebar';
import { StudentProgress, LeerlingOverzicht } from '../../shared/models/process.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leerlingen',
  standalone: true,
  imports: [FormsModule, Sidebar],
  templateUrl: './leerlingen.html',
  styleUrl: './leerlingen.scss',
})
export class Leerlingen implements OnInit {
  leerlingen     = signal<LeerlingOverzicht[]>([]);
  gefilterdeList = signal<LeerlingOverzicht[]>([]);
  loading        = signal(true);
  zoekterm       = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<StudentProgress[]>('http://localhost:3000/api/progress/students').subscribe({
      next: (data) => {
        const map = new Map<number, LeerlingOverzicht>();

        for (const row of data) {
          if (!map.has(row.id)) {
            map.set(row.id, {
              id:          row.id,
              naam:        `${row.voornaam || ''} ${row.achternaam || ''}`.trim(),
              email:       row.email,
              klas:        row.klas_naam || '-',
              level:       0,
              voortgang:   0,
              last_active: null,
              correct:     0,
              answered:    0
            });
          }

          const l = map.get(row.id)!;
          if (row.level_number) {
            l.level    = Math.max(l.level, row.level_number);
            l.correct  += Number(row.correct  || 0);
            l.answered += Number(row.answered || 0);
            if (!l.last_active || new Date(row.last_active) > new Date(l.last_active)) {
              l.last_active = row.last_active;
            }
          }
        }

        const lijst = Array.from(map.values()).map(l => ({
          ...l,
          voortgang: l.answered > 0 ? Math.round((l.correct / l.answered) * 100) : 0
        }));

        this.leerlingen.set(lijst);
        this.gefilterdeList.set(lijst);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filter(): void {
    const term = this.zoekterm.toLowerCase();
    this.gefilterdeList.set(
      this.leerlingen().filter(l =>
        l.naam?.toLowerCase().includes(term) ||
        l.klas?.toLowerCase().includes(term) ||
        l.email?.toLowerCase().includes(term)
      )
    );
  }

  formatDatum(datum: string | null): string {
    if (!datum) return 'Nooit';
    const d    = new Date(datum);
    const nu   = new Date();
    const diff = nu.getTime() - d.getTime();
    const dagen = Math.floor(diff / 86400000);
    const uren  = Math.floor(diff / 3600000);
    if (uren  < 24) return 'Vandaag';
    if (dagen === 1) return 'Gisteren';
    return `${dagen} dagen geleden`;
  }

  bekijkLeerling(id: number): void {
    // later uitbreiden met detailpagina
    this.router.navigate(['/dashboard/leerlingen'], { queryParams: { id } });
  } 
}