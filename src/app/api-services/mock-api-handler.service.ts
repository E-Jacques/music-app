import { Injectable } from '@angular/core';
import { choiceN } from 'src/mockHelpers';
import { ArtistsDto } from 'src/types/api-dto/ArtistsDto';
import { CommentsDto } from 'src/types/api-dto/CommentsDto';
import { GenresDto } from 'src/types/api-dto/GenresDto';
import { MusicArtistsDto } from 'src/types/api-dto/MusicArtistsDto';
import { MusicDto } from 'src/types/api-dto/MusicDto';
import { MusicGenreDto } from 'src/types/api-dto/MusicGenreDto';
import { MusicPlaylistDto } from 'src/types/api-dto/MusicPlaylistDto';
import { PlaylistsDto } from 'src/types/api-dto/PlaylistsDto';
import { RolesDto } from 'src/types/api-dto/RolesDto';
import { SubscriptionsDto } from 'src/types/api-dto/SubscriptionsDto';
import { UsersDto } from 'src/types/api-dto/UsersDto';
import { IApiHandlerService } from './i-api-handler.service';

const mockData: {
  roles: RolesDto[];
  users: UsersDto[];
  subscriptions: SubscriptionsDto[];
  musics: MusicDto[];
  comments: CommentsDto[];
  artists: ArtistsDto[];
  genres: GenresDto[];
  playlists: PlaylistsDto[];
  music_artists: MusicArtistsDto[];
  music_genres: MusicGenreDto[];
  music_playlists: MusicPlaylistDto[];
} = {
  roles: [
    { roleID: 1, name: 'admin' },
    { roleID: 2, name: 'user' },
  ],
  users: [
    {
      userID: 1,
      username: 'CJin362',
      password: 'IUtt183',
      email: 'Kassie.Rakestraw105@example.org',
      firstName: 'Suzann',
      lastName: 'Lavrinov',
      Roles_roleID: 2,
    },
    {
      userID: 2,
      username: 'GStr155',
      password: 'JMcT305',
      email: 'Jemimah.Osmund225@example.org',
      firstName: 'Franz',
      lastName: 'Lowy',
      Roles_roleID: 1,
    },
    {
      userID: 3,
      username: 'CRea7',
      password: 'RBun191',
      email: 'Liuka.Roughan423@example.org',
      firstName: 'Benyamin',
      lastName: 'Jinkins',
      Roles_roleID: 2,
    },
  ],
  subscriptions: [],
  musics: [
    {
      musicID: 1,
      title: 'upnmklmhgx',
      description: 'cmavsucfthdaximfgmsrtymnlzwoeliukykvlpuqlbksdrnhzd',
      publicationDate: '8-11-2005',
      turnOffComments: 0,
      link: 'www.google.com/search?q=nwutxoocla',
      duration: '3:41',
      views: 55,
      likes: '?',
      Users_userID: 1,
    },
    {
      musicID: 2,
      title: 'hizliunoti',
      description: 'qvigmfqfrqrqddthknieprmongkxuydpfqgptldotwdyhoskrl',
      publicationDate: '9-21-2003',
      turnOffComments: 0,
      link: 'www.google.com/search?q=ullfyxbueq',
      duration: '2:18',
      views: 50,
      likes: '?',
      Users_userID: 1,
    },
    {
      musicID: 3,
      title: 'mcuzoapboi',
      description: 'taptwmwphbnbsqigcxxeidtumvtoxrkkwskwepbkkwgurbveyz',
      publicationDate: '2-22-2011',
      turnOffComments: 0,
      link: 'www.google.com/search?q=rfwhrxsshd',
      duration: '1:58',
      views: 21,
      likes: '?',
      Users_userID: 1,
    },
    {
      musicID: 4,
      title: 'shfsarcwhf',
      description: 'czlgpbwhnwtkzhmzewxqscqeylthxhrmvkzvcuczxzmdksetny',
      publicationDate: '2-19-1993',
      turnOffComments: 0,
      link: 'www.google.com/search?q=czgdlvqmuw',
      duration: '5:19',
      views: 88,
      likes: '?',
      Users_userID: 1,
    },
    {
      musicID: 5,
      title: 'otuzzdtgnv',
      description: 'qxadowvhyyfdocckhnraueqcffgpwooitpmeouuzyxqgfwplrv',
      publicationDate: '4-18-1983',
      turnOffComments: 0,
      link: 'www.google.com/search?q=anyeowerwu',
      duration: '3:55',
      views: 97,
      likes: '?',
      Users_userID: 3,
    },
    {
      musicID: 6,
      title: 'opbbnnmfre',
      description: 'izqeqoroteqkupegrmrcpuvgtmuzupgixvkkelmygdvtfowibg',
      publicationDate: '10-26-1997',
      turnOffComments: 0,
      link: 'www.google.com/search?q=qzoecxfizy',
      duration: '3:06',
      views: 56,
      likes: '?',
      Users_userID: 2,
    },
    {
      musicID: 7,
      title: 'ngfncaiine',
      description: 'vszalwgknwfrbvlznxgqyfbqqiznnnnlipkskknfqaparqfypn',
      publicationDate: '1-12-2002',
      turnOffComments: 0,
      link: 'www.google.com/search?q=lfzcwmgpxt',
      duration: '1:43',
      views: 59,
      likes: '?',
      Users_userID: 1,
    },
    {
      musicID: 8,
      title: 'nguyptqfed',
      description: 'klnmmipykoelmxgxagvoayczqmyndaeqkowyzrznqlpqkhefqf',
      publicationDate: '10-16-1986',
      turnOffComments: 0,
      link: 'www.google.com/search?q=ngfngszesu',
      duration: '5:52',
      views: 9,
      likes: '?',
      Users_userID: 3,
    },
    {
      musicID: 9,
      title: 'gnyatvavxa',
      description: 'yphcyybzdkdidpiytltrberiltqezcefcnxvdumdwdxsekhqwc',
      publicationDate: '12-27-1994',
      turnOffComments: 0,
      link: 'www.google.com/search?q=oahlpralmu',
      duration: '5:05',
      views: 21,
      likes: '?',
      Users_userID: 3,
    },
    {
      musicID: 10,
      title: 'bgtoggbpvt',
      description: 'dlbpamnuptqudxvdfaykvtifidzkdvflhzekmmobrfkoulnkmg',
      publicationDate: '10-28-2001',
      turnOffComments: 0,
      link: 'www.google.com/search?q=zvnihlqurl',
      duration: '5:07',
      views: 22,
      likes: '?',
      Users_userID: 2,
    },
  ],
  comments: [
    { commentID: 1, content: 'vluqdfakw', Users_userID: 1, Music_musicID: 4 },
    {
      commentID: 2,
      content: 'rswgzcocpsvaqphdnvxerqpofg',
      Users_userID: 2,
      Music_musicID: 3,
    },
    { commentID: 3, content: 'guqlaefhdi', Users_userID: 3, Music_musicID: 7 },
    {
      commentID: 4,
      content: 'ihivvzksfehqnvalutpxlrqsbkbvdtxdtpqdeyxpnofagt',
      Users_userID: 2,
      Music_musicID: 2,
    },
    {
      commentID: 5,
      content: 'dxiuukvyiiqfwxcmdfct',
      Users_userID: 1,
      Music_musicID: 8,
    },
    { commentID: 6, content: 'bnucghacmq', Users_userID: 3, Music_musicID: 6 },
  ],
  artists: [
    { artistID: 1, name: 'LMec385' },
    { artistID: 2, name: 'SFri42' },
    { artistID: 3, name: 'BTat485' },
  ],
  genres: [
    { tagID: 1, name: 'LGoo392' },
    { tagID: 2, name: 'OBre65' },
  ],
  playlists: [
    {
      playlistID: 1,
      name: 'Playlist-8',
      description: 'vieuuphcghsvlyydternsvyfldinclgubpcgrsbuwdxqvgty',
      Users_userID: 1,
    },
    {
      playlistID: 2,
      name: 'Playlist-71',
      description: 'dqwvkkuilpxogtlbbk',
      Users_userID: 1,
    },
    {
      playlistID: 3,
      name: 'Playlist-123',
      description: 'yesgnbnfgcgwqnzv',
      Users_userID: 3,
    },
    {
      playlistID: 4,
      name: 'Playlist-169',
      description: 'xfboengtnun',
      Users_userID: 3,
    },
    {
      playlistID: 5,
      name: 'Playlist-190',
      description: 'uvbqhmqhkacrnddlhmluqhzodltigrmzcoxeuk',
      Users_userID: 3,
    },
  ],
  music_artists: [
    { Music_musicID: 4, Artists_artistID: 2 },
    { Music_musicID: 8, Artists_artistID: 2 },
    { Music_musicID: 10, Artists_artistID: 3 },
    { Music_musicID: 8, Artists_artistID: 1 },
    { Music_musicID: 9, Artists_artistID: 1 },
    { Music_musicID: 2, Artists_artistID: 2 },
    { Music_musicID: 2, Artists_artistID: 1 },
    { Music_musicID: 4, Artists_artistID: 3 },
    { Music_musicID: 10, Artists_artistID: 3 },
    { Music_musicID: 8, Artists_artistID: 2 },
  ],
  music_genres: [
    { Music_musicID: 3, Genre_genreID: 2 },
    { Music_musicID: 3, Genre_genreID: 1 },
    { Music_musicID: 1, Genre_genreID: 1 },
    { Music_musicID: 1, Genre_genreID: 1 },
    { Music_musicID: 8, Genre_genreID: 1 },
    { Music_musicID: 8, Genre_genreID: 2 },
    { Music_musicID: 4, Genre_genreID: 2 },
    { Music_musicID: 10, Genre_genreID: 2 },
    { Music_musicID: 10, Genre_genreID: 2 },
    { Music_musicID: 7, Genre_genreID: 2 },
  ],
  music_playlists: [
    { Playlists_playlistID: 5, Music_musicID: 5, order: 1 },
    { Playlists_playlistID: 1, Music_musicID: 5, order: 1 },
    { Playlists_playlistID: 2, Music_musicID: 4, order: 1 },
    { Playlists_playlistID: 3, Music_musicID: 3, order: 1 },
    { Playlists_playlistID: 1, Music_musicID: 1, order: 2 },
    { Playlists_playlistID: 3, Music_musicID: 2, order: 2 },
  ],
};

let mockAudioBuffer: ArrayBuffer;
fetch('http://localhost:4200/assets/audio.wav')
  .then((data) => data.arrayBuffer())
  .then((a) => (mockAudioBuffer = a));

let mockAudioBufferBlob: Blob;
fetch('http://localhost:4200/assets/audio.wav')
  .then((data) => data.blob())
  .then((a) => (mockAudioBufferBlob = a));

@Injectable({
  providedIn: 'root',
})
export class MockApiHandlerService implements IApiHandlerService {
  private musicBlocksize: number;

  constructor() {
    this.musicBlocksize = 4096;
  }

  async fetchMusicBufferBlock(
    musicId: number,
    blocknumber: number,
    Nblocks: number
  ): Promise<ArrayBuffer> {
    return new Promise(async (r, errf) => {
      await this.sleep(Math.random() * 0.2 * 1000);
      console.log(mockAudioBufferBlob);
      if (!mockAudioBuffer) return errf(new Error('[500] Mock audio error'));
      const buffer = mockAudioBuffer.slice(
        this.musicBlocksize * blocknumber,
        this.musicBlocksize * (blocknumber + Nblocks)
      );

      r(buffer);
    });
  }

  async fetchMusicBufferBlockBlob(
    musicId: number,
    blocknumber: number,
    Nblocks: number
  ): Promise<ArrayBuffer> {
    return new Promise(async (r, errf) => {
      await this.sleep(Math.random() * 0.2 * 1000);
      console.log(mockAudioBufferBlob);
      if (!mockAudioBuffer) return errf(new Error('[500] Mock audio error'));
      const buffer = mockAudioBuffer.slice(
        this.musicBlocksize * blocknumber,
        this.musicBlocksize * (blocknumber + Nblocks)
      );

      r(buffer);
    });
  }

  async fetchMusicTotalNumberOfBlock(musicId: number): Promise<number> {
    return new Promise(async (r, errf) => {
      await this.sleep(Math.random() * 0.1 * 1000);

      if (!mockAudioBuffer) return errf(new Error('[500] Mock audio error'));
      r(mockAudioBuffer.byteLength);
    });
  }

  getFetchedMusicBlocksize(): number {
    return this.musicBlocksize;
  }

  async fetchMusicById(musicId: number): Promise<MusicDto | null> {
    return new Promise(async (r, _) => {
      await this.sleep(Math.random() * 0.2 * 1000);

      let musics = mockData.musics.filter((a) => a.musicID === musicId);
      if (musics.length === 0) return r(null);

      return r(musics[0]);
    });
  }

  private async sleep(time: number): Promise<void> {
    return new Promise((r, _) => {
      return setTimeout(() => r(), time);
    });
  }

  async fetchPlaylistById(playlistId: number): Promise<PlaylistsDto | null> {
    return new Promise(async (r, _) => {
      await this.sleep(Math.random() * 0.5 * 1000);
      let filtered = mockData.playlists.filter(
        (a) => a.playlistID === playlistId
      );
      if (filtered.length === 0) return r(null);
      else r(filtered[0]);
    });
  }

  async fetchMusicPlaylistById(playlistId: number): Promise<MusicDto[]> {
    return new Promise(async (r, _) => {
      await this.sleep(Math.random() * 3 * 1000);

      let playlistMusic = mockData.music_playlists.filter(
        (a) => a.Playlists_playlistID === playlistId
      );
      let musicsId = playlistMusic.map((a) => a.Music_musicID);

      // TODO handle order

      r(mockData.musics.filter((a) => musicsId.includes(a.musicID)));
    });
  }

  async fetchAllPlaylist(): Promise<PlaylistsDto[]> {
    return new Promise(async (r, _) => {
      await this.sleep(Math.random() * 2 * 1000);
      r(mockData.playlists);
    });
  }

  async fetchHitMusic(): Promise<MusicDto[]> {
    return new Promise(async (r, _) => {
      await this.sleep(Math.random() * 5 * 1000);
      r(choiceN(8, mockData.musics));
    });
  }

  async fetchMusicArtistsById(musicId: number): Promise<ArtistsDto[]> {
    return new Promise(async (r, _) => {
      await this.sleep(Math.random() * 3 * 1000);
      let artistsId = mockData.music_artists
        .filter((obj) => obj.Music_musicID === musicId)
        .map((a) => a.Artists_artistID);

      r(mockData.artists.filter((obj) => artistsId.includes(obj.artistID)));
    });
  }
}
