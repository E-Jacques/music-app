import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-music-controller',
  templateUrl: './music-controller.component.html',
  styleUrls: ['./music-controller.component.scss']
})
export class MusicControllerComponent {
  @Input() musicPaused!: boolean;
  
  @Output() pauseMusic = new EventEmitter();
  @Output() playMusic = new EventEmitter();

  changeMusicState () {
    if (this.musicPaused) {
      this.playMusic.emit()
    } else {
      this.pauseMusic.emit()
    }
  }
}
