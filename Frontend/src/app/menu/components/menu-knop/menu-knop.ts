import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-knop',
  standalone: true,
  imports: [],
  templateUrl: './menu-knop.html',
  styleUrl: './menu-knop.scss',
})
export class MenuKnop {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() actief: boolean = false;
  @Input() uitgeschakeld: boolean = false;

  @Output() geklikt = new EventEmitter<void>();

  onKlik(): void {
    if (!this.uitgeschakeld) {
      this.geklikt.emit();
    }
  }
}
