import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { PlaylistsDto } from 'src/types/api-dto/PlaylistsDto';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';
import { EventBusService } from '../event-bus.service';
import { EventData, EventDataEnum } from '../event-data';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {
  protected playlist?: PlaylistsDto;
  protected playlistMusic: MusicDto[];
  protected imgColor: String = "bg-blue-600";

  constructor(private mockApiHandler: MockApiHandlerService, private route: ActivatedRoute, private router: Router, private eventBus: EventBusService) {
    this.playlist = undefined;
    this.playlistMusic = []
  }

  async ngOnInit() {
    let playlistIdStr: string | null = this.route.snapshot.paramMap.get("id");
    if (!playlistIdStr) {
      this.eventBus.emit(new EventData(EventDataEnum.ERROR_POPUP, "Cannot properly read id specified in url. Redirect to playlist menu."))
      this.router.navigate(["playlist"]);
      return;
    }

    const playlistId = Number.parseInt(playlistIdStr);
    let playlist = await this.mockApiHandler.fetchPlaylistById(playlistId);
    if (!playlist) {
      this.eventBus.emit(new EventData(EventDataEnum.ERROR_POPUP, "Queried playlist doesn't exists. Redirect to playlist menu."))
      this.router.navigate(["playlist"]);
      return;
    }

    this.playlist = playlist;
    this.playlistMusic = await this.mockApiHandler.fetchMusicPlaylistById(playlist.playlistID);
  }

  protected playAllPlaylist() {
    this.playlistMusic.forEach(({ musicID }) => {
      this.eventBus.emit(new EventData(EventDataEnum.ADD_MUSIC_TO_QUEUE, musicID))
    })
  }

  protected playOneMusic(musicId: number) {
    this.eventBus.emit(new EventData(EventDataEnum.CLEAR_MUSIC_QUEUE, null))
    this.eventBus.emit(new EventData(EventDataEnum.ADD_MUSIC_TO_QUEUE, musicId));
  }

  protected firstLetter() {
    if (!this.playlist) {
      return "?"
    }
    return this.playlist.name.toUpperCase()[0]
  }
}
