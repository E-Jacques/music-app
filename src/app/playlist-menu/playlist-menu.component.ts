import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistsDto } from 'src/types/api-dto/PlaylistsDto';
import { UsersDto } from 'src/types/api-dto/UsersDto';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';
import { MockAuthService } from '../auth-services/mock-auth.service';
import { EventBusService } from '../event-bus.service';
import { EventData, EventDataEnum } from '../event-data';

@Component({
  selector: 'app-playlist-menu',
  templateUrl: './playlist-menu.component.html',
  host: {
    class: 'h-full w-full',
  },
  styleUrls: ['./playlist-menu.component.scss'],
})
export class PlaylistMenuComponent implements OnInit {
  protected userPlaylists: PlaylistsDto[] = [];
  protected subsPlaylists: PlaylistsDto[] = [];

  protected userPlaylistsLoading = false;
  protected subsPlaylistsLoading = false;

  constructor(
    private apiHandler: MockApiHandlerService,
    protected authService: MockAuthService,
    private eventBus: EventBusService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.userPlaylistsLoading = true;
    this.subsPlaylistsLoading = true;

    if (!this.authService.isLoggedIn()) {
      this.eventBus.emit(
        new EventData(
          EventDataEnum.ERROR_POPUP,
          'Should be logged to access /playlists/. Redirected to /.'
        )
      );
      this.router.navigate(['/']);
      return;
    }

    const user = this.authService.getUser() as UsersDto;
    this.userPlaylists = await this.apiHandler.fetchPlaylistByOwnerId(
      user.userID
    );
    this.userPlaylistsLoading = false;

    const subs = await this.apiHandler.fetchSubscriptionsByUserId(user.userID);
    for (let sub of subs) {
      this.subsPlaylists.push(
        ...(await this.apiHandler.fetchPlaylistByOwnerId(sub.userID))
          .filter((a) => a.name === 'Likes')
          .map((a) => ({ ...a, name: sub.username + "'s likes" }))
      );
    }
    this.subsPlaylistsLoading = false;
  }

  redirectToPlaylist(playlistId: number) {
    this.router.navigate(['playlist', playlistId]);
  }
}
