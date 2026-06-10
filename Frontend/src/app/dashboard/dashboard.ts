import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ProgressService } from '../shared/services/progress';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  groupedStudents = signal<any[]>([]);
  loading         = signal(true);
  error           = signal('');

  constructor(
    private progressService: ProgressService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.progressService.getAllStudents().subscribe({
      next: (data) => {
        this.groupedStudents.set(this.groupByStudent(data));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Kon leerlingdata niet ophalen.');
        this.loading.set(false);
      }
    });
  }

  groupByStudent(rows: any[]): any[] {
    const map = new Map<number, any>();
    for (const row of rows) {
      if (!map.has(row.id)) {
        map.set(row.id, { id: row.id, username: row.username, email: row.email, levels: [] });
      }
      if (row.level_number !== null) {
        map.get(row.id).levels.push({
          level_number: row.level_number,
          level_title:  row.level_title,
          completed:    row.completed,
          last_active:  row.last_active,
          answered:     row.answered,
          correct:      row.correct
        });
      }
    }
    return Array.from(map.values());
  }

  getScore(levels: any[]): string {
    const total   = levels.reduce((sum: number, l: any) => sum + Number(l.answered || 0), 0);
    const correct = levels.reduce((sum: number, l: any) => sum + Number(l.correct  || 0), 0);
    if (total === 0) return 'Nog niet gespeeld';
    return `${correct} / ${total} goed`;
  }

  logout(): void {
    this.authService.logout();
  }
}