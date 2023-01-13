import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-music-controller',
  templateUrl: './music-controller.component.html',
  styleUrls: ['./music-controller.component.scss'],
})
export class MusicControllerComponent {
  @Input('musicPaused') musicPaused!: boolean;
  @Input('duration') duration?: number; // In s
  @Input('currentTime') currentTime!: number; // In s
  @Input() time: number = 0;

  @Output() pauseMusic = new EventEmitter();
  @Output() playMusic = new EventEmitter();

  get progression(): number {
    if (!this.duration || this.duration <= 0) return 0;

    return (this.currentTime / this.duration) * 100;
  }

  changeMusicState() {
    if (this.musicPaused) {
      this.playMusic.emit();
    } else {
      this.pauseMusic.emit();
    }
  }

  durationString(): string {
    if (!this.duration) return '0:00';

    return Math.floor(this.duration / 60) + ':' + (this.duration % 60);
  }
}
