import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  templateUrl: './connected-user.component.html',
  host: {
    class: 'h-full w-full',
  },
  styleUrls: ['./connected-user.component.scss'],
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
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadingPlaylists = true;
    this.loadingComments = true;
    this.loadingSubscriptions = true;

    if (!this.authService.isLoggedIn()) {
      this.eventBus.emit(
        new EventData(
          EventDataEnum.ERROR_POPUP,
          'You should be connected to access this page'
        )
      );
      this.router.navigate(['/auth']);
      return;
    }

    const user = this.authService.getUser() as UsersDto;
    this.userInfo = await this.apiHandler.fetchUserById(user.userID);

    if (!this.userInfo) {
      this.eventBus.emit(
        new EventData(
          EventDataEnum.ERROR_POPUP,
          'An error occured while fetching user informations. Redirected to home page.'
        )
      );
      this.router.navigate(['/']);
      return;
    }

    this.userPlaylists = await this.apiHandler.fetchPlaylistByOwnerId(
      user.userID
    );
    this.loadingPlaylists = false;

    this.userSubscriptions = await this.apiHandler.fetchSubscriptionsByUserId(
      user.userID
    );
    this.loadingSubscriptions = false;

    this.userComments = await this.apiHandler.fetchCommentsByWritterId(
      user.userID
    );
    this.loadingComments = false;
  }

  redirectToPlaylist(playlistId: number): void {
    this.router.navigate(['playlists', playlistId]);
  }

  redirectToUser(userId: number): void {
    this.router.navigate(['user', userId]);
  }
}
