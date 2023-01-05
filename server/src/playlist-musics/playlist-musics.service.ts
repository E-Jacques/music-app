import { Injectable } from '@nestjs/common';
import { CreatePlaylistMusicDto } from './dto/create-playlist-music.dto';
import { UpdatePlaylistMusicDto } from './dto/update-playlist-music.dto';

@Injectable()
export class PlaylistMusicsService {
  create(createPlaylistMusicDto: CreatePlaylistMusicDto) {
    return 'This action adds a new playlistMusic';
  }

  findAll() {
    return `This action returns all playlistMusics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlistMusic`;
  }

  update(id: number, updatePlaylistMusicDto: UpdatePlaylistMusicDto) {
    return `This action updates a #${id} playlistMusic`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlistMusic`;
  }
}
