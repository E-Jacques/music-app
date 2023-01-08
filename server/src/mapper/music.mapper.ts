import { MusicDto } from '@/music/dto/music.dto';
import { Music } from '@/music/entities/music.entity';
import { toArtistsDto } from './artists.mapper';
import { toGenresDto } from './genres.mapper';

export function toMusicDto(music: Music): MusicDto {
  return {
    musicID: music.musicid,
    title: music.title,
    description: music.description,
    publicationDate: music.publicationdate.toLocaleDateString('fr-FR'),
    turnOffComments: music.turnoffcomments,
    Users_userID: music.user.userid,
    artists: music.artists.map(toArtistsDto),
    genres: music.genres.map(toGenresDto),
    duration: music.duration,
  };
}
