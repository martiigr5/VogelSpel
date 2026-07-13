import { Component, Input, Output, EventEmitter, output } from '@angular/core';

@Component({
  selector: 'app-level-kaart',
  standalone: true,
  imports: [],
  templateUrl: './level-kaart.html',
  styleUrl: './level-kaart.scss',
})
export class LevelKaart {
  @Input() level: any = null;
  @Input() naam: string = '';
  @Input() uitgeschakeld: boolean = false;

  @Output() geklikt = new EventEmitter<any>();

  onKlik(): void {
    if (!this.uitgeschakeld) {
      this.geklikt.emit(this.level);
    }
  }
}
