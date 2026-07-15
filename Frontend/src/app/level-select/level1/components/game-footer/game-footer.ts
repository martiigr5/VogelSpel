import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-footer',
  standalone: true,
  imports: [],
  templateUrl: './game-footer.html',
  styleUrl: './game-footer.scss',
})
export class GameFooter {
  @Output() gepauzeerd = new EventEmitter<void>();
  @Output() geholpen = new EventEmitter<void>();
  @Output() gestopt = new EventEmitter<void>();

  onPauze(): void {
    this.gepauzeerd.emit();
  }

  onHelp(): void {
    this.geholpen.emit();
  }

  onStop(): void {
    this.gestopt.emit();
  }
}
