import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-level-klaar',
  standalone: true,
  imports: [],
  templateUrl: './level-klaar.html',
  styleUrl: './level-klaar.scss',
})
export class LevelKlaar {
  @Input() score: number = 0;

  @Output() terugNaarMenu = new EventEmitter<void>();

  onTerug(): void {
    this.terugNaarMenu.emit();
  }
}
