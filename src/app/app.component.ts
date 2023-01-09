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
import { MockApiHandlerService } from './api-services/mock-api-handler.service';
import { EventBusService } from './event-bus.service';
import { EventData, EventDataEnum } from './event-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frontend';
  musicPlaying = false;
  musicPaused = true;
  showNavMenu = false;

  volumeMuted = false;
  volumeLevel = 100;

  totalDuration = 0;

  currentMusicInfo?: MusicDto | null;
  currentMusicIdx: number = -1; // idx of musicIdQueue
  musicIdQueue: number[] = [];

  popupQueue: { message: string; type: string }[] = [];

  audioCtx: AudioContext = new window.AudioContext();
  audioSource?: AudioBufferSourceNode;
  currentBlock: number = 0;
  maxBlock?: number;

  maxBlockToLoad: number = 30 * 4;
  eventBusListener: Subscription[] = [];

  audioBuffer: (AudioBuffer | null)[] = [null, null, null, null];

  @ViewChild('audioElement')
  audioMediaElement?: ElementRef<HTMLAudioElement>;

  constructor(
    private eventBus: EventBusService,
    private apiHandlerService: MockApiHandlerService
  ) {}

  ngOnDestroy(): void {
    this.audioSource?.removeEventListener('ended', this.endedEventListener);

    this.eventBusListener.forEach((a) => a.unsubscribe());
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
    this.currentMusicIdx++;
    this.audioBuffer = this.audioBuffer.map((_) => null);
    const nextMusicId = this.musicIdQueue[this.currentMusicIdx];
    this.currentMusicInfo = await this.apiHandlerService.fetchMusicById(
      nextMusicId
    );
    this.currentBlock = 0;
    this.totalDuration = 0;

    let flag = true;
    while (flag) {
      flag = await this.loadFirstEmptySlotOfAudioBuffer(this.maxBlockToLoad);
    }

    console.log('play');
    this.playNextBlock();
  }

  async loadFirstEmptySlotOfAudioBuffer(Nblocks: number): Promise<boolean> {
    const idx = this.audioBuffer.indexOf(null);

    if (idx < 0) return false;

    const buffer = await this.apiHandlerService.fetchMusicBufferBlockBlob(
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

    this.audioBuffer[idx] = audioData;
    return true;
  }

  private rotateAudioBuffer() {
    if (this.audioBuffer[0] !== null) return;

    for (let i = 0; i < this.audioBuffer.length - 1; i++) {
      this.audioBuffer[i] = this.audioBuffer[i + 1];
    }

    this.audioBuffer[this.audioBuffer.length - 1] = null;
  }

  async playNextBlock() {
    const audioData = this.audioBuffer[0];

    if (!audioData) {
      this.loadNextMusic();
      return;
    }
    this.rotateAudioBuffer();

    // const buffer = await this.apiHandlerService.fetchMusicBufferBlockBlob(
    //   this.musicIdQueue[this.currentMusicIdx],
    //   this.currentBlock,
    //   this.maxBlockToLoad
    // );

    // this.currentBlock += this.maxBlockToLoad;

    // const audioData = await this.audioCtx.decodeAudioData(
    //   buffer,
    //   (_) => {
    //     console.log(_);
    //   },
    //   (err) => {
    //     if (err) console.error(err);
    //   }
    // );

    if (this.audioSource) {
      this.audioSource.removeEventListener(
        'ended',
        this.endedEventListener.bind(this)
      );
    }

    this.audioSource = this.audioCtx.createBufferSource();
    this.audioSource.addEventListener(
      'ended',
      this.endedEventListener.bind(this)
    );

    this.audioSource.buffer = audioData;

    this.audioSource.start(0);
    this.totalDuration += audioData.duration;
    this.loadFirstEmptySlotOfAudioBuffer(this.maxBlockToLoad);
  }

  playMusic() {
    this.musicPaused = false;
  }

  pauseMusic() {
    this.musicPaused = true;
  }

  switchShowNavMenuState() {
    this.showNavMenu = !this.showNavMenu;
  }

  switchVolumeMutedState() {
    this.volumeMuted = !this.volumeMuted;

    if (!this.audioMediaElement) return;
    this.audioMediaElement.nativeElement.muted = this.volumeMuted;
  }

  updateVolume(value: number) {
    this.volumeLevel = value;

    if (!this.audioMediaElement) return;
    this.audioMediaElement.nativeElement.volume = this.volumeLevel / 100;
  }
}
