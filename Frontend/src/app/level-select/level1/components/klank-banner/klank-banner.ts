import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-klank-banner',
  standalone: true,
  imports: [],
  templateUrl: './klank-banner.html',
  styleUrl: './klank-banner.scss',
})
export class KlankBanner implements OnChanges {
  @Input() items: any[] = [];

  @Output() itemVerwerkt  = new EventEmitter<{ item: any; isGoed: boolean }>();
  @Output() levelVoltooid = new EventEmitter<void>();

  klanken           = ['aa', 'oe', 'ie'];
  huidigeKlankIndex = 0;
  currentKlank      = 'aa';
  gevonden          = new Set<number>();
  feedback          = '';
  feedbackType      = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items.length > 0) {
      this.toonKlank();
    }
  }

  get correcteItems(): any[] {
    return this.items.filter(item => item.klank === this.currentKlank);
  }

  get alleGevonden(): boolean {
    return this.correcteItems.every(item => this.gevonden.has(item.id));
  }

  toonKlank(): void {
    this.currentKlank = this.klanken[this.huidigeKlankIndex];
    this.gevonden     = new Set<number>();
    this.feedback     = `Klik op alle voorwerpen met de klank "${this.currentKlank.toUpperCase()}"!`;
    this.feedbackType = 'info';
  }

  verwerkKlik(item: any): void {
    if (this.gevonden.has(item.id)) return;

    const isGoed = item.klank === this.currentKlank;

    this.itemVerwerkt.emit({ item, isGoed });

    if (isGoed) {
      this.gevonden.add(item.id);
      this.feedback     = `✅ Ja! "${item.name}" heeft de klank "${this.currentKlank.toUpperCase()}"!`;
      this.feedbackType = 'Goed';

      if (this.alleGevonden) {
        setTimeout(() => this.volgendeKlank(), 1500);
      }
    } else {
      this.feedback     = `❌ Nee, "${item.name}" heeft niet de klank "${this.currentKlank.toUpperCase()}".`;
      this.feedbackType = 'Fout';
    }
  }

  volgendeKlank(): void {
    if (this.huidigeKlankIndex < this.klanken.length - 1) {
      this.huidigeKlankIndex++;
      this.toonKlank();
    } else {
      this.feedback     = '🎉 Level voltooid! Goed gedaan!';
      this.feedbackType = 'Goed';
      this.levelVoltooid.emit();
    }
  }

  isGevonden(item: any): boolean {
    return this.gevonden.has(item.id);
  }
}