import { ArtistsDto } from 'src/types/api-dto/ArtistsDto';
import { CommentsDto } from 'src/types/api-dto/CommentsDto';
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
