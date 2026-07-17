import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Hotspot } from '../hotspot/hotspot';
import { InventoryItem } from '../../../../shared/models/game.model';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [Hotspot],
  templateUrl: './scene.html',
  styleUrl: './scene.scss',
})
export class Scene {
  @Input() items:    InventoryItem[] = [];
  @Input() gevonden: Set<number> = new Set();
  @Input() sceneImage: string = '';

  @Output() itemGeklikt = new EventEmitter<InventoryItem>();


 
  isGevonden(item: InventoryItem): boolean {
    return this.gevonden.has(item.id);
  }

  onItemGeklikt(item: InventoryItem): void {
    this.itemGeklikt.emit(item);
  }
}