import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { PlaylistsDto } from 'src/types/api-dto/PlaylistsDto';
import { SearchResultDto } from 'src/types/api-dto/SearchResultDto';
import { SearchResultTypeEnum } from 'src/types/SearchResultType.enum';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';
import { EventBusService } from '../event-bus.service';
import { EventData, EventDataEnum } from '../event-data';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss'],
})
export class HomeMenuComponent implements OnInit {
  protected playlistList: PlaylistsDto[] = [];
  protected hitMusicList: MusicDto[] = [];

  protected SearchResultTypeEnum = SearchResultTypeEnum;
  protected resultSection: SearchResultTypeEnum = SearchResultTypeEnum.TITLE;
  protected loadingSearch: boolean = false;
  protected searchResult: SearchResultDto | null = null;

  constructor(
    private eventBus: EventBusService,
    private mockApiHandler: MockApiHandlerService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.playlistList = await this.mockApiHandler.fetchAllPlaylist();
    this.hitMusicList = await this.mockApiHandler.fetchHitMusic();
  }

  protected async getMusicAuthorsFormated(musicId: number): Promise<String> {
    const artists = await this.mockApiHandler.fetchMusicArtistsById(musicId);
    return artists.map((a) => a.name).join(', ');
  }

  playMusic(musicId: number): void {
    this.eventBus.emit(
      new EventData(EventDataEnum.ADD_MUSIC_TO_QUEUE, musicId)
    );
  }

  redirectToPlaylist(playlistId: number): void {
    this.router.navigate(['playlist', playlistId]);
  }

  redirectToArtist(artistId: number): void {
    this.router.navigate(['artists', artistId]);
  }

  redirectToUser(userId: number): void {
    this.router.navigate(['user', userId]);
  }

  setResultSection(searchResultType: SearchResultTypeEnum) {
    this.resultSection = searchResultType;
  }

  async search(content: string): Promise<void> {
    // limit isn't took into a count in mock api
    this.searchResult = null;

    console.log(content);
    this.loadingSearch = true;
    this.searchResult = await this.mockApiHandler.searchByText(content, 10);
    this.loadingSearch = false;
  }
}
