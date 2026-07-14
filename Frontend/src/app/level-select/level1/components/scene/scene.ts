import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotspot} from  '../hotspot/hotspot';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [CommonModule, Hotspot],
  templateUrl: './scene.html',
  styleUrl: './scene.scss',
})
export class Scene {
  @Input() items: any[] = [];
  @Input() gevonden: number[] = [];
  @Input() sceneImage: string = '';

  @Output() itemGeklikt = new EventEmitter<any>();

  isGevonden(item: any): boolean {
    return this.gevonden.includes(item.id);
  }

  onItemGeklikt(item: any): void {
    this.itemGeklikt.emit(item);
  }
}
