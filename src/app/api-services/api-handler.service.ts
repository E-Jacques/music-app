import { IApiHandlerService } from './i-api-handler.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ArtistsDto } from 'src/types/api-dto/ArtistsDto';
import { CommentsDto } from 'src/types/api-dto/CommentsDto';
import { FullMusicDto } from 'src/types/api-dto/FullMusicDto';
import { GenresDto } from 'src/types/api-dto/GenresDto';
import { MusicCreateDto } from 'src/types/api-dto/MusicCreateDto';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { PlaylistsDto } from 'src/types/api-dto/PlaylistsDto';
import { SearchResultDto } from 'src/types/api-dto/SearchResultDto';
import { UsersDto } from 'src/types/api-dto/UsersDto';
import { catchError, throwError } from 'rxjs';
import { MockApiHandlerService } from './mock-api-handler.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService implements IApiHandlerService {
  readonly BASE_URL = 'http://localhost:3000/api/';

  readonly BASIC_HEADER = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  private join(...paths: string[]): string {
    let s = '';
    if (paths.length === 0) return s;
    if (paths.length === 1) return paths[0];

    let newPaths: string[] = [];
    if (paths[0].at(-1) === '/')
      newPaths.push(paths[0].substring(0, paths[0].length - 1));
    for (let i = 1; i < paths.length - 1; i++) {
      let curr = paths[i];
      if (curr[0] === '/') curr = curr.substring(1);
      if (curr.at(-1) === '/') curr = curr.substring(0, paths[0].length - 1);

      newPaths.push(curr);
    }

    const last = paths.at(-1);
    if (last && last[0] === '/')
      newPaths.push(last.substring(1, paths[0].length));

    return newPaths.join('/');
  }

  private async GET<T>(
    URL: string,
    query: { [key: string]: string | number } = {},
    headers: any = this.BASIC_HEADER,
    expectArrayBuffer: boolean = false,
    baseURL: string = this.BASE_URL
  ): Promise<T> {
    let queryString = '';
    if (Object.keys(query).length > 0) {
      const queryItems = Object.keys(query).map(
        (key) => `${key}=${query[key]}`
      );
      queryString = '?' + queryItems.join('&');
    }

    return new Promise(async (resolve, reject) => {
      const completeUrl = this.join(baseURL, URL) + queryString;
      fetch(completeUrl, { method: 'GET', headers })
        .then((res: Response) => {
          if (expectArrayBuffer) {
            res
              .arrayBuffer()
              .then((data) => resolve(data as T))
              .catch((err) => reject(err));
          } else {
            resolve(res.json());
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private async POST<T>(
    URL: string,
    data: unknown,
    headers: any = this.BASIC_HEADER,
    baseURL: string = this.BASE_URL
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const completeUrl = this.join(baseURL, URL);
      fetch(completeUrl, {
        method: 'GET',
        headers,
        body: data instanceof FormData ? data : JSON.stringify(data),
      })
        .then((res: Response) => {
          resolve(res.json());
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private httpAuthHeaderPart(token: string): { Authorization: string } {
    return { Authorization: 'Bearer ' + token };
  }

  async fetchAllPlaylist(
    limit: number,
    offset: number
  ): Promise<PlaylistsDto[]> {
    let playlists: PlaylistsDto[] = [];
    try {
      playlists = await this.GET<PlaylistsDto[]>('/playlists/', {
        limit,
        offset,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }

    return playlists;
  }

  async fetchAllGenres(limit: number, offset: number): Promise<GenresDto[]> {
    let genres: GenresDto[] = [];
    try {
      genres = await this.GET<GenresDto[]>('/genres/', {
        limit,
        offset,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }

    return genres;
  }

  async fetchAllArtists(limit: number, offset: number): Promise<ArtistsDto[]> {
    let artists: ArtistsDto[] = [];
    try {
      artists = await this.GET<ArtistsDto[]>('/artists/', {
        limit,
        offset,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }

    return artists;
  }

  async fetchHitMusic(limit: number, offset: number): Promise<MusicDto[]> {
    let musics: MusicDto[] = [];
    try {
      musics = await this.GET<MusicDto[]>('/music/hits/', { limit, offset });
    } catch (error: any) {
      throw new Error(error.message);
    }

    return musics;
  }

  async submitMusic(
    data: MusicCreateDto,
    file: File,
    token: string
  ): Promise<number> {
    let musicId: number = -1;

    let formdata = new FormData();
    formdata.append('title', data.title);
    formdata.append('description', data.description);
    formdata.append('turnoffcomments', data.turnOffComments ? 'true' : 'false');
    formdata.append('artists', data.artistIds.toString());
    formdata.append('genres', data.genreIds.toString());

    formdata.append('file', file);

    try {
      musicId = await this.POST<number>(
        '/music/',
        formdata,
        new HttpHeaders({
          ...this.BASIC_HEADER,
          'Content-Type': 'multipart/form-data',
          ...this.httpAuthHeaderPart(token),
        })
      );
    } catch (error: any) {
      throw new Error(error.message);
    }

    return musicId;
  }

  fetchUserById(userId: number): Promise<UsersDto | null> {
    return this.GET<UsersDto | null>(`/users/${userId}`);
  }

  fetchPlaylistByOwnerId(ownerId: number): Promise<PlaylistsDto[]> {
    return this.GET<PlaylistsDto[]>(`/playlists/user/${ownerId}`);
  }

  fetchSubscriptionsByUserId(userId: number): Promise<UsersDto[]> {
    return this.GET<UsersDto[]>(`/subscriptions/users/${userId}`);
  }

  fetchSubscribeState(subscribeTo: number, token: string): Promise<boolean> {
    return this.GET<boolean>(
      `/subscriptions/to/${subscribeTo}`,
      {},
      {
        ...this.BASIC_HEADER,
        ...this.httpAuthHeaderPart(token),
      }
    );
  }

  /**
   * source: https://docs.ksqldb.io/en/latest/developer-guide/api/
   */
  async fetchMusicLikeNumber(musicId: number): Promise<number> {
    const res = await this.POST<any>(
      'query',
      {
        ksql: 'SELECT LIKES FROM MUSIC WHERE MUSICID=' + musicId + ';',
        streamProperties: {},
      },
      {
        Accept: 'application/vnd.ksql.v1+json',
      },
      'http://localhost:8088'
    );

    return res[1]?.row?.columns[0] || 0;
  }

  async fetchMusicViewNumber(musicId: number): Promise<number> {
    const res = await this.POST<any>(
      'query',
      {
        ksql: 'SELECT VIEWS FROM MUSIC WHERE MUSICID=' + musicId + ';',
        streamProperties: {},
      },
      {
        Accept: 'application/vnd.ksql.v1+json',
      },
      'http://localhost:8088'
    );

    return res[1]?.row?.columns[0] || 0;
  }

  subscribe(subscribeTo: number, token: string): Promise<void> {
    return this.POST<void>(
      `subscriptions/subscribe/${subscribeTo}`,
      {},
      {
        ...this.BASIC_HEADER,
        ...this.httpAuthHeaderPart(token),
      }
    );
  }

  unsubscribe(subscribeTo: number, token: string): Promise<void> {
    return this.POST<void>(
      `subscriptions/unsubscribe/${subscribeTo}`,
      {},
      {
        ...this.BASIC_HEADER,
        ...this.httpAuthHeaderPart(token),
      }
    );
  }

  fetchCommentsByWritterId(
    writterId: number,
    limit: number = -1,
    offset: number = 0
  ): Promise<CommentsDto[]> {
    return this.GET<CommentsDto[]>(`comments/user/${writterId}`, {
      limit,
      offset,
    });
  }

  fetchMusicArtistsById(
    musicId: number,
    limit: number = -1,
    offset: number = 0
  ): Promise<ArtistsDto[]> {
    return this.GET<ArtistsDto[]>(`artists/music/${musicId}`, {
      limit,
      offset,
    });
  }

  fetchPlaylistById(playlistId: number): Promise<PlaylistsDto | null> {
    return this.GET<PlaylistsDto | null>(`playlists/${playlistId}`);
  }

  fetchMusicPlaylistById(
    playlistId: number,
    limit: number = -1,
    offset: number = 0
  ): Promise<MusicDto[]> {
    return this.GET<MusicDto[]>(`music/playlist/${playlistId}`, {
      limit,
      offset,
    });
  }

  fetchMusicById(musicId: number): Promise<MusicDto | null> {
    return this.GET<MusicDto | null>(`music/${musicId}`);
  }

  fetchMusicByGenresId(
    genreId: number,
    limit: number = -1,
    offset: number = 0
  ): Promise<MusicDto[]> {
    return this.GET<MusicDto[]>(`music/genres/${genreId}`, { limit, offset });
  }

  fetchLikeState(musicId: number, token: string): Promise<boolean> {
    // const playlists = this.GET<PlaylistsDto[]>(`playlists/user`);
    throw new Error('Method not implemented.');
  }
  like(musicId: number, token: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  unlike(musicId: number, token: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteComment(commentId: number, token: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  publishComment(
    content: string,
    musicId: number,
    token: string
  ): Promise<CommentsDto | null> {
    throw new Error('Method not implemented.');
  }
  fetchCommentsByMusicId(
    musicId: number,
    limit: number,
    offset: number
  ): Promise<CommentsDto[]> {
    throw new Error('Method not implemented.');
  }
  addMusicToPlaylist(
    playlistId: number,
    musicId: number,
    token: string
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeMusicFromPlaylist(
    playlistID: number,
    musicId: number,
    token: string
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  fetchMusicBufferBlock(
    musicId: number,
    blocknumber: number,
    Nblocks: number
  ): Promise<ArrayBuffer> {
    throw new Error('Method not implemented.');
  }
  fetchUserPlaylists<B extends boolean>(
    userId: number,
    withMusic: B
  ): Promise<
    B extends true ? (PlaylistsDto & { musics: MusicDto[] })[] : PlaylistsDto[]
  > {
    throw new Error('Method not implemented.');
  }
  fetchArtistById(artistId: number): Promise<ArtistsDto | null> {
    throw new Error('Method not implemented.');
  }
  searchByText(text: string, limit: number): Promise<SearchResultDto> {
    throw new Error('Method not implemented.');
  }
  getFetchedMusicBlocksize(): number {
    throw new Error('Method not implemented.');
  }
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: UsersDto }> {
    const { access_token } = await this.POST<{ access_token: string }>(
      `auth/login`,
      {
        email,
        password,
      }
    );

    const user = await this.GET<UsersDto>(
      `auth/whoami`,
      {},
      {
        ...this.BASIC_HEADER,
        ...this.httpAuthHeaderPart(access_token),
      }
    );

    return {
      token: access_token,
      user,
    };
  }
  register({
    lastName,
    firstName,
    email,
    password,
    username,
  }: {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    username: string;
  }): Promise<UsersDto> {
    return this.POST<UsersDto>(`auth/register`, {
      lastname: lastName,
      firstname: firstName,
      email,
      password,
      username,
    });
  }
}