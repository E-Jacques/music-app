import { PlaylistDto } from '@/playlists/dto/playlist.dto';
import { Playlists } from '@/playlists/entities/playlist.entity';

export function toPlaylistDto(playlist: Playlists): PlaylistDto {
  return {
    playlistID: playlist.playlistid,
    name: playlist.name,
    description: playlist.description,
    Users_userID: playlist.user.userid,
  };
}
