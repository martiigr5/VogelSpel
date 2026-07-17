import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Session } from '../../../shared/models/process.model'

@Component({
  selector: 'app-sessie-kaart',
  standalone: true,
  imports: [],
  templateUrl: './sessie-kaart.html',
  styleUrl: './sessie-kaart.scss',
})
export class SessieKaart {
  @Input() sessie!: Session;

  @Output() geladen    = new EventEmitter<Session>();
  @Output() verwijderd = new EventEmitter<Session>();

  onLaad(): void {
    this.geladen.emit(this.sessie);
  }

  onVerwijder(event: Event): void {
    event.stopPropagation();
    this.verwijderd.emit(this.sessie);
  }

  formatDatum(datum: string): string {
    if (!datum) return '';
    const d    = new Date(datum);
    const nu   = new Date();
    const diff = nu.getTime() - d.getTime();
    const uren = Math.floor(diff / 3600000);
    if (uren < 24) return `vandaag ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  getVoortgang(): number {
    const answered = Number(this.sessie?.answered || 0);
    return Math.min(Math.round((answered / 12) * 100), 100);
  }
}