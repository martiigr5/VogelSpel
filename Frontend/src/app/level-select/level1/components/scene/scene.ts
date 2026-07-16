import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Hotspot } from '../hotspot/hotspot';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [Hotspot],
  templateUrl: './scene.html',
  styleUrl: './scene.scss',
})
export class Scene {
  @Input() items:    any[]       = [];
  @Input() gevonden: Set<number> = new Set();
  @Input() sceneImage: string = '';

  @Output() itemGeklikt = new EventEmitter<any>();


 
  isGevonden(item: any): boolean {
    return this.gevonden.has(item.id);
  }

  onItemGeklikt(item: any): void {
    this.itemGeklikt.emit(item);
  }
}