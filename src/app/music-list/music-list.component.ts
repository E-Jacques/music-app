import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { PlaylistsDto } from 'src/types/api-dto/PlaylistsDto';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.scss'],
})
export class MusicListComponent {
  @Input('musics') musics!: MusicDto[];

  @Output('play') playEvent = new EventEmitter<number>();
  @Output('clear-queue') clearQueueEvent = new EventEmitter<void>();
  @Output('like-music') likeMusicEvent = new EventEmitter<number>();
  @Output('add-music-playlists') addMusicToPlaylistsEvent = new EventEmitter<{
    music: number;
    playlists: number[];
  }>();

  @ViewChild('action_menu')
  private actionMenuHTML!: ElementRef<HTMLDivElement>;

  private menuWinPos = { x: 0, y: 0 };
  protected displayActionMenu = false;
  private associatedMusicId = -1;

  protected displayPlaylistsMenu = false;
  protected selectedPlaylists: number[] = [];
  protected loadingPlaylist = false;
  protected userPlaylists: PlaylistsDto[] = [];

  constructor(
    private render: Renderer2,
    private apiHandler: MockApiHandlerService
  ) {}

  play(musicId: number) {
    this.playEvent.emit(musicId);
  }

  openActionMenu(event: MouseEvent, associatedMusic: number) {
    if (this.displayActionMenu) {
      this.displayActionMenu = false;
      associatedMusic = -1;
      return;
    }

    this.displayActionMenu = true;
    this.associatedMusicId = associatedMusic;
    this.menuWinPos = {
      x: event.clientX,
      y: event.clientY,
    };

    setTimeout(() => {
      this.render.setStyle(
        this.actionMenuHTML.nativeElement,
        'left',
        `${this.menuWinPos.x - this.actionMenuHTML.nativeElement.clientWidth}px`
      );
      this.render.setStyle(
        this.actionMenuHTML.nativeElement,
        'top',
        `${this.menuWinPos.y}px`
      );
      this.render.setStyle(this.actionMenuHTML.nativeElement, 'opacity', '1');
    }, 1);
  }

  actionPlayNow() {
    this.clearQueueEvent.emit();
    this.play(this.associatedMusicId);
  }

  actionPlayAfter() {
    this.play(this.associatedMusicId);
  }

  actionLike() {
    this.likeMusicEvent.emit(this.associatedMusicId);
  }

  actionAddToPlaylist() {
    this.addMusicToPlaylistsEvent.emit({
      music: this.associatedMusicId,
      playlists: this.selectedPlaylists,
    });

    this.actionHidePlaylistsMenu();
    this.displayActionMenu = false;
  }

  actionAddPlaylistToSelection(playlistId: number) {
    if (this.selectedPlaylists.includes(playlistId)) {
      this.selectedPlaylists.splice(
        this.selectedPlaylists.indexOf(playlistId),
        1
      );
      return;
    }
    this.selectedPlaylists.push(playlistId);
  }

  async actionDisplayPlaylistsMenu() {
    this.selectedPlaylists = [];
    this.displayPlaylistsMenu = true;
    this.loadingPlaylist = true;
    // TODO: modular fetch with current user id
    let req = await this.apiHandler.fetchUserPlaylists(1, true);
    req = req.filter((a) => a.name.toLowerCase() !== 'liked');

    this.selectedPlaylists = req
      .filter((a) =>
        a.musics.map((b) => b.musicID).includes(this.associatedMusicId)
      )
      .map((a) => a.playlistID);

    this.userPlaylists = req.map((a) => {
      let { musics: _, ...playlist } = a;
      return playlist;
    });

    this.loadingPlaylist = false;
  }

  actionHidePlaylistsMenu() {
    this.displayPlaylistsMenu = false;
  }
}
