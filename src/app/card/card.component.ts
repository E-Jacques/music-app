import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input('imgColor') imgColor: String = 'bg-blue-600';
  @Input('name') name!: String;
  @Input('description') description?: String | null;
  @Input('playable') playable?: boolean;

  @Output('play') playEvent = new EventEmitter<null>();

  private descriptionLimitSize = 16;

  firstLetter() {
    return this.name[0].toUpperCase();
  }

  shortenDescription() {
    if (!this.description) return '';
    return this.description.slice(0, this.descriptionLimitSize - 3) + '...';
  }

  play() {
    if (this.playable) this.playEvent.emit();
  }
}
