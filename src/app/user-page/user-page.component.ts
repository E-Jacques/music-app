import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsDto } from 'src/types/api-dto/CommentsDto';
import { PlaylistsDto } from 'src/types/api-dto/PlaylistsDto';
import { SubscriptionsDto } from 'src/types/api-dto/SubscriptionsDto';
import { UsersDto } from 'src/types/api-dto/UsersDto';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';
import { MockAuthService } from '../auth-services/mock-auth.service';
import { EventBusService } from '../event-bus.service';
import { EventData, EventDataEnum } from '../event-data';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-page.component.html',
  host: {
    class: 'h-full w-full',
  },
  styleUrls: ['./user-page.component.scss'],
})
export class ConnectedUserComponent implements OnInit {
  protected userInfo: UsersDto | null = null;
  protected userPlaylists: PlaylistsDto[] = [];
  protected userSubscriptions: UsersDto[] = [];
  protected userComments: CommentsDto[] = [];

  protected loadingPlaylists: boolean = false;
  protected loadingSubscriptions: boolean = false;
  protected loadingComments: boolean = false;

  constructor(
    private apiHandler: MockApiHandlerService,
    private authService: MockAuthService,
    private eventBus: EventBusService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadingPlaylists = true;
    this.loadingComments = true;
    this.loadingSubscriptions = true;

    const userIdStr = this.route.snapshot.paramMap.get('id');
    if (!userIdStr) {
      this.eventBus.emit(
        new EventData(
          EventDataEnum.ERROR_POPUP,
          'Cannot properly read id specified in url. Redirect to playlist menu.'
        )
      );
      this.router.navigate(['']);
      return;
    }

    const userId = Number.parseInt(userIdStr);
    this.userInfo = await this.apiHandler.fetchUserById(userId);
    if (!this.userInfo) {
      this.eventBus.emit(
        new EventData(
          EventDataEnum.ERROR_POPUP,
          "Queried user doesn't exists. Redirect to home menu."
        )
      );
      this.router.navigate(['/']);
      return;
    }

    this.userPlaylists = await this.apiHandler.fetchPlaylistByOwnerId(
      this.userInfo.userID
    );
    this.loadingPlaylists = false;

    this.userSubscriptions = await this.apiHandler.fetchSubscriptionsByUserId(
      this.userInfo.userID
    );
    this.loadingSubscriptions = false;

    this.userComments = await this.apiHandler.fetchCommentsByWritterId(
      this.userInfo.userID
    );
    this.loadingComments = false;
  }

  redirectToPlaylist(playlistId: number): void {
    this.router.navigate(['playlist', playlistId]);
  }

  redirectToUser(userId: number): void {
    this.router.navigate(['user', userId]);
  }
}
