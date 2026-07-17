import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Level } from '../../../shared/models/game.model';

@Component({
  selector: 'app-level-kaart',
  standalone: true,
  imports: [],
  templateUrl: './level-kaart.html',
  styleUrl: './level-kaart.scss',
})
export class LevelKaart {
  @Input() level!: Level;
  @Input() naam: string = '';
  @Input() uitgeschakeld: boolean = false;

  @Output() geklikt = new EventEmitter<any>();

  onKlik(): void {
    if (!this.uitgeschakeld) {
      this.geklikt.emit(this.level);
    }
  }
}
