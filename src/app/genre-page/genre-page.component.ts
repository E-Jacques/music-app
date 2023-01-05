import { Component, OnInit } from '@angular/core';
import { GenresDto } from 'src/types/api-dto/GenresDto';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';
import { EventBusService } from '../event-bus.service';
import { EventData, EventDataEnum } from '../event-data';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.scss'],
})
export class GenrePageComponent implements OnInit {
  protected genreList: GenresDto[] = [];
  protected musicToShow: MusicDto[] = [];
  protected loadingMusic: boolean = false;
  protected selectedGenre: number = 0;

  constructor(
    private apiHandler: MockApiHandlerService,
    private eventBus: EventBusService
  ) {}

  async ngOnInit(): Promise<void> {
    this.genreList = await this.apiHandler.fetchAllGenres();

    await this.updateMusicToShow(0);
  }

  async updateMusicToShow(musicIdx: number): Promise<void> {
    this.selectedGenre = musicIdx;
    this.loadingMusic = true;
    this.musicToShow = await this.apiHandler.fetchMusicByGenresId(
      this.genreList[this.selectedGenre].tagID
    );
    this.loadingMusic = false;
  }

  playOneMusic(musicId: number) {
    this.eventBus.emit(
      new EventData(EventDataEnum.ADD_MUSIC_TO_QUEUE, musicId)
    );
  }
}
