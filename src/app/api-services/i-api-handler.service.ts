import { ArtistsDto } from 'src/types/api-dto/ArtistsDto';
import { CommentsDto } from 'src/types/api-dto/CommentsDto';
import { FullMusicDto } from 'src/types/api-dto/FullMusicDto';
import { GenresDto } from 'src/types/api-dto/GenresDto';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { PlaylistsDto } from 'src/types/api-dto/PlaylistsDto';
import { SearchResultDto } from 'src/types/api-dto/SearchResultDto';
import { UsersDto } from 'src/types/api-dto/UsersDto';

export interface IApiHandlerService {
  fetchAllPlaylist(limit: number, offset: number): Promise<PlaylistsDto[]>;

  fetchAllGenres(limit: number, offset: number): Promise<GenresDto[]>;

  fetchHitMusic(): Promise<MusicDto[]>;

  fetchUserById(userId: number): Promise<UsersDto | null>;

  fetchPlaylistByOwnerId(ownerId: number): Promise<PlaylistsDto[]>;

  fetchSubscriptionsByUserId(userId: number): Promise<UsersDto[]>;

  fetchSubscribeState(subscribeTo: number, token: string): Promise<boolean>;

  subscribe(subscribeTo: number, token: string): Promise<void>;

  unsubscribe(subscribeTo: number, token: string): Promise<void>;

  fetchCommentsByWritterId(writterId: number): Promise<CommentsDto[]>;

  fetchMusicArtistsById(musicId: number): Promise<ArtistsDto[]>;

  fetchPlaylistById(playlistId: number): Promise<PlaylistsDto | null>;

  fetchMusicPlaylistById(playlistId: number): Promise<MusicDto[]>;

  fetchMusicById(musicId: number): Promise<MusicDto | null>;

  fetchMusicByGenresId(genreId: number): Promise<MusicDto[]>;

  fetchLikeState(musicId: number, token: string): Promise<boolean>;

  like(musicId: number, token: string): Promise<void>;

  unlike(musicId: number, token: string): Promise<void>;

  fetchPopulatedMusic(musicId: number): Promise<FullMusicDto | null>;

  publishComment(
    content: string,
    musicId: number,
    token: string
  ): Promise<CommentsDto | null>;

  fetchCommentsByMusicId(
    musicId: number,
    limit: number,
    offset: number
  ): Promise<CommentsDto[]>;

  addMusicToPlaylist(
    playlistId: number,
    musicId: number,
    token: string
  ): Promise<void>;

  removeMusicFromPlaylist(
    playlistID: number,
    musicId: number,
    token: string
  ): Promise<void>;

  fetchMusicBufferBlock(
    musicId: number,
    blocknumber: number,
    Nblocks: number
  ): Promise<ArrayBuffer>;

  fetchMusicTotalNumberOfBlock(musicId: number): Promise<number>;

  fetchUserPlaylists<B extends boolean>(
    userId: number,
    withMusic: B
  ): Promise<
    B extends true ? (PlaylistsDto & { musics: MusicDto[] })[] : PlaylistsDto[]
  >;

  fetchArtistById(artistId: number): Promise<ArtistsDto | null>;

  searchByText(text: string, limit: number): Promise<SearchResultDto>;

  getFetchedMusicBlocksize(): number;

  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: UsersDto }>;

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
  }): Promise<UsersDto>;
}
