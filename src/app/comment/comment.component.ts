import { Component, Input, OnInit } from '@angular/core';
import { CommentsDto } from 'src/types/api-dto/CommentsDto';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { UsersDto } from 'src/types/api-dto/UsersDto';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';
import { MockAuthService } from '../auth-services/mock-auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input('comment') comment!: CommentsDto;

  protected owner: UsersDto | null = null;
  protected music: MusicDto | null = null;

  constructor(
    private apiHandler: MockApiHandlerService,
    private authService: MockAuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.owner = await this.apiHandler.fetchUserById(this.comment.Users_userID);
    this.music = await this.apiHandler.fetchMusicById(
      this.comment.Music_musicID
    );
  }

  get isOwner(): boolean {
    if (!this.authService.isLoggedIn()) return false;

    const loggedUser = this.authService.getUser() as UsersDto;
    return loggedUser.userID === this.ownerId;
  }

  get ownerId(): number {
    if (!this.owner) {
      return -1;
    }

    return this.owner.userID;
  }

  get musicId(): number {
    if (!this.music) {
      return -1;
    }

    return this.music.musicID;
  }

  get ownerUsername(): String {
    if (!this.owner) {
      return 'OWNER ERROR';
    }

    return this.owner.username;
  }

  get musicTitle(): String {
    if (!this.music) {
      return 'MUSIC ERROR';
    }

    return this.music.title;
  }
}
