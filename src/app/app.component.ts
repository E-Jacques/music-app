import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { MockApiHandlerService } from './api-services/mock-api-handler.service';
import { EventBusService } from './event-bus.service';
import { EventData, EventDataEnum } from './event-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'frontend';
  musicPlaying = false;
  musicPaused = true;
  showNavMenu = false;

  volumeMuted = false;
  volumeLevel = 100;

  currentMusicInfo?: MusicDto | null;
  currentMusicIdQueue: number[] = [];

  popupQueue: { message: String; type: string }[] = [];

  audioCtx: AudioContext = new window.AudioContext();
  audioSource: AudioBufferSourceNode = this.audioCtx.createBufferSource();
  currentBlock: number = 0;
  maxBlock?: number;

  maxBlockToLoad: number = 1000;

  @ViewChild('audioElement')
  audioMediaElement?: ElementRef<HTMLAudioElement>;

  constructor(
    private eventBus: EventBusService,
    private apiHandlerService: MockApiHandlerService
  ) {}

  ngOnInit(): void {
    this.eventBus.on(
      EventDataEnum.ADD_MUSIC_TO_QUEUE,
      async (musicId: number) => {
        this.currentMusicIdQueue.push(musicId);
        if (this.currentMusicIdQueue.length === 1) await this.loadNextMusic();
        this.musicPlaying = true;
      }
    );

    this.eventBus.on(EventDataEnum.ERROR_POPUP, (message: string) => {
      this.popupQueue.push({ message, type: 'error' });
    });

    this.eventBus.on(EventDataEnum.INFO_POPUP, (message: string) => {
      this.popupQueue.push({ message, type: 'info' });
    });

    this.eventBus.on(EventDataEnum.CLEAR_MUSIC_QUEUE, () => {
      this.currentMusicIdQueue = [];
    });
  }

  ngAfterViewInit(): void {
    this.audioMediaElement?.nativeElement.addEventListener('ended', () => {
      // this.loadNextBlocks(10); // Temporary disabled
    });
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
    const buffer = await this.apiHandlerService.fetchMusicBufferBlock(
      this.currentMusicIdQueue[0],
      this.currentBlock,
      Math.min(Nblocks, this.maxBlock)
    );
    this.currentBlock += Nblocks;

    const blob = new Blob([new Uint8Array(buffer, 0, buffer.byteLength)], {
      type: 'audio/wav',
    });

    const blobURL = URL.createObjectURL(blob);
    this.audioMediaElement.nativeElement.src = blobURL;

    this.audioMediaElement.nativeElement
      .play()
      .then(() => console.log('Should run'))
      .catch((err) => console.error(err));

    // const audioData = await this.audioCtx.decodeAudioData(
    //   buffer,
    //   (data) => {
    //     console.log(data.getChannelData(0));
    //     console.log(data.getChannelData(1));
    //   },
    //   (err) => {
    //     if (err) console.error(err);
    //   }
    // );
    // console.log(audioData);
    // this.audioSource.buffer = audioData;

    // console.log(this.audioSource.connect(this.audioCtx.destination));
    // this.audioSource.start(0);
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
