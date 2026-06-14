import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-instellingen',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './instellingen.html',
  styleUrl: './instellingen.scss',
})
export class Instellingen implements OnInit {
  leerlingen     = signal<any[]>([]);
  klassen        = signal<any[]>([]);
  bewerkLeerling = signal<any>(null);
  loading        = signal(true);
  melding        = signal('');
  meldingType    = signal('');

  // Nieuw leerling formulier
  nieuwVoornaam   = '';
  nieuwAchternaam = '';
  nieuwEmail      = '';
  nieuwKlasId     = '';

  // Nieuwe klas
  nieuweKlas = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.laadLeerlingen();
    this.laadKlassen();
  }

  laadLeerlingen(): void {
    this.http.get<any[]>('http://localhost:3000/api/leerlingen').subscribe({
      next: (data) => {
        this.leerlingen.set(data);
        this.loading.set(false);
      },
      error: () => this.toonMelding('Leerlingen ophalen mislukt', 'fout')
    });
  }

  laadKlassen(): void {
    this.http.get<any[]>('http://localhost:3000/api/klassen').subscribe({
      next: (data) => this.klassen.set(data),
      error: () => this.toonMelding('Klassen ophalen mislukt', 'fout')
    });
  }

  leerlingToevoegen(): void {
    if (!this.nieuwVoornaam || !this.nieuwAchternaam || !this.nieuwEmail) {
      this.toonMelding('Vul alle velden in', 'fout');
      return;
    }

    this.http.post<any>('http://localhost:3000/api/leerlingen', {
      voornaam:   this.nieuwVoornaam,
      achternaam: this.nieuwAchternaam,
      email:      this.nieuwEmail,
      klas_id:    this.nieuwKlasId || null
    }).subscribe({
      next: () => {
        this.nieuwVoornaam   = '';
        this.nieuwAchternaam = '';
        this.nieuwEmail      = '';
        this.nieuwKlasId     = '';
        this.laadLeerlingen();
        this.toonMelding('Leerling toegevoegd!', 'goed');
      },
      error: (err) => this.toonMelding(err.error?.error || 'Toevoegen mislukt', 'fout')
    });
  }

  leerlingVerwijderen(id: number): void {
    if (!confirm('Weet je zeker dat je deze leerling wilt verwijderen?')) return;
    this.http.delete(`http://localhost:3000/api/leerlingen/${id}`).subscribe({
      next: () => {
        this.laadLeerlingen();
        this.toonMelding('Leerling verwijderd', 'goed');
      },
      error: () => this.toonMelding('Verwijderen mislukt', 'fout')
    });
  }

  bewerkStart(leerling: any): void {
    this.bewerkLeerling.set({ ...leerling });
  }

  bewerkOpslaan(): void {
    const l = this.bewerkLeerling();
    if (!l) return;

    this.http.put(`http://localhost:3000/api/leerlingen/${l.id}`, l).subscribe({
      next: () => {
        this.bewerkLeerling.set(null);
        this.laadLeerlingen();
        this.toonMelding('Leerling bijgewerkt!', 'goed');
      },
      error: () => this.toonMelding('Bewerken mislukt', 'fout')
    });
  }

  klasToevoegen(): void {
    if (!this.nieuweKlas) {
      this.toonMelding('Vul een klasnaam in', 'fout');
      return;
    }
    this.http.post<any>('http://localhost:3000/api/klassen', { naam: this.nieuweKlas }).subscribe({
      next: () => {
        this.nieuweKlas = '';
        this.laadKlassen();
        this.toonMelding('Klas toegevoegd!', 'goed');
      },
      error: (err) => this.toonMelding(err.error?.error || 'Toevoegen mislukt', 'fout')
    });
  }

  klasVerwijderen(id: number): void {
    if (!confirm('Weet je zeker dat je deze klas wilt verwijderen?')) return;
    this.http.delete(`http://localhost:3000/api/klassen/${id}`).subscribe({
      next: () => {
        this.laadKlassen();
        this.toonMelding('Klas verwijderd', 'goed');
      },
      error: () => this.toonMelding('Verwijderen mislukt', 'fout')
    });
  }

  toonMelding(tekst: string, type: string): void {
    this.melding.set(tekst);
    this.meldingType.set(type);
    setTimeout(() => this.melding.set(''), 3000);
  }
}