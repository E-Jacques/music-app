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

  currentMusicInfo?: MusicDto | null;
  currentMusicIdQueue: number[] = [];

  popupQueue: { message: string; type: string }[] = [];

  audioCtx: AudioContext = new window.AudioContext();
  audioSource?: AudioBufferSourceNode;
  currentBlock: number = 0;
  maxBlock?: number;

  maxBlockToLoad: number = 10 * 4;
  eventBusListener: Subscription[] = [];

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
          this.currentMusicIdQueue.push(musicId);
          if (this.currentMusicIdQueue.length === 1) await this.loadNextMusic();
          this.musicPlaying = true;
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
        this.currentMusicIdQueue = [];
      })
    );
  }

  endedEventListener(): void {
    this.loadNextBlocks(this.maxBlockToLoad);
  }

  removeErrorMessage(messageIndex: number) {
    if (messageIndex >= this.popupQueue.length) return;

    this.popupQueue.splice(messageIndex, 1);
  }

  async loadNextMusic() {
    const nextMusicId = this.currentMusicIdQueue[0];
    this.currentMusicInfo = await this.apiHandlerService.fetchMusicById(
      nextMusicId
    );

    const blocknumber =
      await this.apiHandlerService.fetchMusicTotalNumberOfBlock(nextMusicId);

    this.maxBlock = blocknumber;
    this.currentBlock = 0;

    await this.loadNextBlocks(this.maxBlockToLoad);
  }

  async loadNextBlocks(Nblocks: number = 1) {
    if (!this.maxBlock || !this.audioMediaElement) return;

    // this.eventBus.emit(
    //   new EventData(
    //     EventDataEnum.ERROR_POPUP,
    //     `[NO ERROR] loading blocks ${Array.from(
    //       { length: Nblocks },
    //       (_, a) => a + this.currentBlock
    //     ).join(', ')}`
    //   )
    // );
    const buffer = await this.apiHandlerService.fetchMusicBufferBlockBlob(
      this.currentMusicIdQueue[0],
      this.currentBlock,
      Nblocks // Math.min(Nblocks, this.maxBlock)
    );
    // this.audioSource.
    this.currentBlock += Nblocks;

    // const blob = new Blob([new Uint8Array(buffer, 0, buffer.byteLength)], {
    //   type: 'audio/mpeg',
    // });

    // const blobURL = URL.createObjectURL(blob);
    // this.audioMediaElement.nativeElement.src = blobURL;

    // this.audioMediaElement.nativeElement
    //   .play()
    //   .then(() => console.log('Should run'))
    //   .catch((err) => console.error(err));

    const audioData = await this.audioCtx.decodeAudioData(
      buffer,
      (data) => {
        console.log(data.getChannelData(0));
        console.log(data.getChannelData(1));
      },
      (err) => {
        if (err) console.error(err);
      }
    );

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

    console.log(this.audioSource.connect(this.audioCtx.destination));
    this.audioSource.start(0);
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
