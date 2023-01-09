import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-music-controller',
  templateUrl: './music-controller.component.html',
  styleUrls: ['./music-controller.component.scss'],
})
export class MusicControllerComponent {
  @Input() musicPaused!: boolean;
  @Input() duration?: number; // In s
  @Input() currentTime!: number; // In s
  @Input() time: number = 0;

  @Output() pauseMusic = new EventEmitter();
  @Output() playMusic = new EventEmitter();

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
