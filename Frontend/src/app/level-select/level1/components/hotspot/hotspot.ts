import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InventoryItem  } from '../../../../shared/models/game.model';

@Component({
  selector: 'app-hotspot',
  standalone: true,
  imports: [],
  templateUrl: './hotspot.html',
  styleUrl: './hotspot.scss',
})
export class Hotspot {
  @Input() item!: InventoryItem;
  @Input() gevonden: boolean = false;

  @Output() itemGeklikt = new EventEmitter<InventoryItem>();

  onKlik(): void {
    if (!this.gevonden && this.item) {
      this.itemGeklikt.emit(this.item);
    }
  }
}
 