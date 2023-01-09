import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsDto } from 'src/types/api-dto/CommentsDto';
import { FullMusicDto } from 'src/types/api-dto/FullMusicDto';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';
import { MockAuthService } from '../auth-services/mock-auth.service';
import { EventBusService } from '../event-bus.service';
import { EventData, EventDataEnum } from '../event-data';

@Component({
  selector: 'app-music-page',
  templateUrl: './music-page.component.html',
  styleUrls: ['./music-page.component.scss'],
})
export class MusicPageComponent implements OnInit {
  protected musicInfo?: MusicDto;
  protected comments: CommentsDto[] = [];

  protected like: number = 10;
  protected views: number = 233;
  protected isLike = false;

  protected loadingMusic = false;
  protected loadingComments = false;

  protected commentContent: string = '';

  constructor(
    private apiHandler: MockApiHandlerService,
    protected authService: MockAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private eventBus: EventBusService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadingMusic = true;
    this.loadingComments = true;

    const musicIdStr = this.route.snapshot.paramMap.get('id');
    if (!musicIdStr) {
      this.eventBus.emit(
        new EventData(
          EventDataEnum.ERROR_POPUP,
          'Cannot properly read id specified in url. Redirect to home menu.'
        )
      );
      this.router.navigate(['']);
      return;
    }

    const musicId = Number.parseInt(musicIdStr);
    let music = await this.apiHandler.fetchMusicById(musicId);
    if (!music) {
      this.eventBus.emit(
        new EventData(
          EventDataEnum.ERROR_POPUP,
          "Queried music doesn't exists. Redirect to home menu."
        )
      );
      this.router.navigate(['']);
      return;
    }
    this.musicInfo = music;
    this.loadingMusic = false;

    // TODO: Should subscribe to like & views
  }

  async loadNextComments() {
    this.loadingComments = true;
    const limit = 5;
    if (!this.musicInfo) return;

    const comments = await this.apiHandler.fetchCommentsByMusicId(
      this.musicInfo.musicID
    );
    this.comments.push(...comments);
    this.loadingComments = false;
  }

  get genreFormat(): string {
    if (!this.musicInfo) return '';
    return this.musicInfo.genres.map((a) => a.name).join(', ');
  }

  async updateIsLike(): Promise<void> {
    if (!this.authService.isLoggedIn() || !this.musicInfo) {
      this.isLike = false;
      return;
    }

    this.isLike =
      (await this.apiHandler
        .fetchLikeState(
          this.musicInfo.musicID,
          this.authService.getToken() as string
        )
        .catch((err) => {
          this.eventBus.emit(new EventData(EventDataEnum.ERROR_POPUP, err));
        })) || false;
  }

  actionLikeButton() {
    if (this.isLike) {
      this.unlikeMusic();
    } else {
      this.likeMusic();
    }
  }

  likeMusic() {
    if (!this.authService.isLoggedIn() || !this.musicInfo) return;
    this.apiHandler
      .like(this.musicInfo.musicID, this.authService.getToken() as string)
      .then(() => {
        this.isLike = true;
      })
      .catch((err) => {
        this.eventBus.emit(new EventData(EventDataEnum.ERROR_POPUP, err));
      });
  }

  unlikeMusic() {
    if (!this.authService.isLoggedIn() || !this.musicInfo) return;
    this.apiHandler
      .unlike(this.musicInfo.musicID, this.authService.getToken() as string)
      .then(() => {
        this.isLike = false;
      })
      .catch((err) => {
        this.eventBus.emit(new EventData(EventDataEnum.ERROR_POPUP, err));
      });
  }

  play() {
    if (!this.musicInfo) return;

    this.eventBus.emit(new EventData(EventDataEnum.CLEAR_MUSIC_QUEUE, null));
    this.eventBus.emit(
      new EventData(EventDataEnum.ADD_MUSIC_TO_QUEUE, this.musicInfo.musicID)
    );
  }

  async publishComment() {
    if (
      !this.authService.isLoggedIn() ||
      !this.musicInfo ||
      this.commentContent === ''
    )
      return;

    this.apiHandler
      .publishComment(
        this.commentContent,
        this.musicInfo.musicID,
        this.authService.getToken() as string
      )
      .then((comment) => {
        if (comment) {
          this.comments.push(comment);
        }
      });
  }
}
