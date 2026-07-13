import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() gebruikersnaam = '';
  @Input() klas = '';
  @Input() toonTerug = true;
  @Input() toonUitloggen = false;

  @Output() terugGeklikt = new EventEmitter<void>();
  @Output() uitloggenGeklikt = new EventEmitter<void>();

  onTerug(): void {
    this.terugGeklikt.emit();
  }

  onUitloggen(): void {
    this.uitloggenGeklikt.emit()
  }
}
