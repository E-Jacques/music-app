import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { ApiHandlerService } from './api-services/api-handler.service';
import { EventBusService } from './event-bus.service';
import { EventDataEnum } from './event-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  protected title = 'frontend';
  protected musicPlaying = false;
  protected musicPaused = true;
  protected showNavMenu = false;

  protected volumeMuted = false;
  protected volumeLevel = 100;

  protected currentMusicInfo?: MusicDto | null;
  private currentMusicIdx: number = -1; // idx of musicIdQueue
  private musicIdQueue: number[] = [];

  protected popupQueue: { message: string; type: string }[] = [];

  private audioCtx: AudioContext = new window.AudioContext();
  private currentBlock: number = 0;

  private maxBlockToLoad: number = 10 * 4;
  private eventBusListener: Subscription[] = [];
  private pauseDelay: number = 0;
  private startMusicDate: Date | null = null;
  private startBufferDate: Date | null = null;
  private startPauseDate: Date | null = null;

  protected totalDuration = 0;
  private totalDurationInterval: NodeJS.Timer | null = null;

  private audioSourceBuffer: (AudioBufferSourceNode | null)[] = [
    null,
    null,
    null,
    null,
  ];

  constructor(
    private eventBus: EventBusService,
    private apiHandlerService: ApiHandlerService
  ) {}

  ngOnDestroy(): void {
    this.audioSourceBuffer.forEach((a) => {
      if (a) a.removeEventListener('ended', this.endedEventListener.bind(this));
    });

    this.eventBusListener.forEach((a) => a.unsubscribe());
    if (this.totalDurationInterval) clearInterval(this.totalDurationInterval);
  }

  ngOnInit(): void {
    this.eventBusListener.push(
      this.eventBus.on(
        EventDataEnum.ADD_MUSIC_TO_QUEUE,
        async (musicId: number) => {
          this.musicIdQueue.push(musicId);
          if (this.musicIdQueue.length === 1) {
            await this.loadNextMusic();
            this.musicPlaying = true;
          }
        }
      )
    );

    this.eventBusListener.push(
      this.eventBus.on(EventDataEnum.ERROR_POPUP, (message: string) => {
        this.popupQueue.push({ message, type: 'error' });
      })
    );

    this.eventBusListener.push(
      this.eventBus.on(EventDataEnum.INFO_POPUP, (message: string) => {
        this.popupQueue.push({ message, type: 'info' });
      })
    );

    this.eventBusListener.push(
      this.eventBus.on(EventDataEnum.CLEAR_MUSIC_QUEUE, () => {
        this.musicIdQueue = [];
      })
    );
  }

  endedEventListener(): void {
    this.playNextBlock();
  }

  removeErrorMessage(messageIndex: number) {
    if (messageIndex >= this.popupQueue.length) return;

    this.popupQueue.splice(messageIndex, 1);
  }

  async loadNextMusic() {
    this.startMusicDate = null;
    this.startPauseDate = null;
    this.currentMusicIdx++;
    this.audioSourceBuffer = this.audioSourceBuffer.map((_) => null);
    const nextMusicId = this.musicIdQueue[this.currentMusicIdx];
    this.currentMusicInfo = await this.apiHandlerService.fetchMusicById(
      nextMusicId
    );
    this.currentBlock = 0;
    this.totalDurationInterval = setInterval(
      this.computeTotalDuration.bind(this),
      50
    );

    let flag = true;
    while (flag) {
      flag = await this.loadFirstEmptySlotOfAudioBuffer(this.maxBlockToLoad);
    }

    this.playNextBlock();
  }

  private async loadFirstEmptySlotOfAudioBuffer(
    Nblocks: number
  ): Promise<boolean> {
    const idx = this.audioSourceBuffer.indexOf(null);

    if (idx < 0) return false;

    const lastAudioSource = this.audioSourceBuffer[idx];
    if (lastAudioSource) {
      lastAudioSource.removeEventListener(
        'ended',
        this.endedEventListener.bind(this)
      );
    }

    const buffer = await this.apiHandlerService.fetchMusicBufferBlock(
      this.musicIdQueue[this.currentMusicIdx],
      this.currentBlock,
      Nblocks
    );

    this.currentBlock += Nblocks;

    const audioData = await this.audioCtx.decodeAudioData(
      buffer,
      (_) => {},
      (err) => {
        if (err) console.error(err);
      }
    );
    const audioSource = this.audioCtx.createBufferSource();

    audioSource.addEventListener('ended', this.endedEventListener.bind(this));

    audioSource.buffer = audioData;

    audioSource.connect(this.audioCtx.destination);
    this.audioSourceBuffer[idx] = audioSource;
    return true;
  }

  private rotateAudioBuffer() {
    if (this.audioSourceBuffer[0] === null) return;

    for (let i = 0; i < this.audioSourceBuffer.length - 1; i++) {
      this.audioSourceBuffer[i] = this.audioSourceBuffer[i + 1];
    }

    this.audioSourceBuffer[this.audioSourceBuffer.length - 1] = null;
  }

  private async playNextBlock() {
    const audioSource = this.audioSourceBuffer[0];

    if (!audioSource) {
      this.loadNextMusic();
      return;
    }
    this.rotateAudioBuffer();

    audioSource.start(0);
    this.musicPaused = false;
    this.startBufferDate = new Date();
    if (!this.startMusicDate) this.startMusicDate = new Date();

    this.loadFirstEmptySlotOfAudioBuffer(this.maxBlockToLoad);
  }

  private computeTotalDuration(): void {
    if (!this.startMusicDate) {
      this.totalDuration = 0;
      return;
    }

    let currPauseTime = 0;
    if (this.startPauseDate)
      currPauseTime = Math.abs(
        this.startPauseDate?.getTime() - new Date().getTime()
      );

    const timedelta = Math.abs(
      new Date().getTime() -
        this.startMusicDate.getTime() -
        this.pauseDelay -
        currPauseTime
    );

    this.totalDuration = timedelta / 1000;
  }

  playMusic() {
    let playDelay = 0;
    if (this.startPauseDate) {
      const pauseTime = Math.abs(
        (this.startPauseDate?.getTime() || 0) - new Date().getTime()
      );
      if (this.startBufferDate) {
        playDelay = Math.abs(
          this.startBufferDate.getTime() - new Date().getTime() - pauseTime
        );
      }
      this.pauseDelay += pauseTime;
    }

    this.startPauseDate = null;
    this.audioSourceBuffer[0]?.start(playDelay);
    this.musicPaused = false;
  }

  pauseMusic() {
    if (this.audioSourceBuffer[0]) {
      this.startPauseDate = new Date();
      this.audioSourceBuffer[0].stop();
    }

    this.musicPaused = true;
  }

  switchShowNavMenuState() {
    this.showNavMenu = !this.showNavMenu;
  }

  switchVolumeMutedState() {
    this.volumeMuted = !this.volumeMuted;
  }

  updateVolume(value: number) {
    this.volumeLevel = value;
  }
}
