import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Header } from "../shared/components/header/header";
import { SessieKaart } from './components/sessie-kaart/sessie-kaart';
import { Session } from '../shared/models/process.model';

@Component({
  selector: 'app-laden',
  standalone: true,
  imports: [Header, SessieKaart],
  templateUrl: './laden.html',
  styleUrl: './laden.scss'
})
export class Laden implements OnInit {
  sessies = signal<Session[]>([]);
  loading = signal(true);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<Session[]>('http://localhost:3000/api/progress/me').subscribe({
      next: (data) => {
        this.sessies.set(data.filter(s => !s.completed));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  laadSessie(sessie: Session): void {
    if (sessie.level_number === 1) {
      this.router.navigate(['/level-select/level1']);
    }
  }

  verwijderSessie(sessie: Session): void {
    this.http.delete(`http://localhost:3000/api/progress/session/${sessie.id}`).subscribe({
      next: () => {
        this.sessies.set(this.sessies().filter(s => s.id !== sessie.id));
      }
    });
  }

  terugNaarMenu(): void {
    this.router.navigate(['/menu']);
  }
}