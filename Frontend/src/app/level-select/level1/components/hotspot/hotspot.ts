import { Component, Input, Output, EventEmitter, input } from '@angular/core';

@Component({
  selector: 'app-hotspot',
  standalone: true,
  imports: [],
  templateUrl: './hotspot.html',
  styleUrl: './hotspot.scss',
})
export class Hotspot {
  @Input() item: any = null;
  @Input() gevonden: boolean = false;

  @Output() itemGeklikt = new EventEmitter<any>();

  onKlik(): void {
    if (!this.gevonden) {
      this.itemGeklikt.emit(this.item);
    }
  }
}
