import { ArtistsDto } from 'src/types/api-dto/ArtistsDto';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { PlaylistsDto } from 'src/types/api-dto/PlaylistsDto';

export interface IApiHandlerService {
  fetchAllPlaylist(): Promise<PlaylistsDto[]>;

  fetchHitMusic(): Promise<MusicDto[]>;

  fetchMusicArtistsById(musicId: number): Promise<ArtistsDto[]>;

  fetchPlaylistById(playlistId: number): Promise<PlaylistsDto | null>;

  fetchMusicPlaylistById(playlistId: number): Promise<MusicDto[]>;

  fetchMusicById(musicId: number): Promise<MusicDto | null>;

  fetchMusicBufferBlock(
    musicId: number,
    blocknumber: number,
    Nblocks: number
  ): Promise<ArrayBuffer>;

  fetchMusicTotalNumberOfBlock(musicId: number): Promise<number>;

  getFetchedMusicBlocksize(): number;
}
