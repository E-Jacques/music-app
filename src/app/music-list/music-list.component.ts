import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MusicDto } from 'src/types/api-dto/MusicDto';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.scss'],
})
export class MusicListComponent {
  @Input('musics') musics!: MusicDto[];
  @Output('play') playEvent = new EventEmitter<number>();

  play(musicId: number) {
    this.playEvent.emit(musicId);
  }
}
