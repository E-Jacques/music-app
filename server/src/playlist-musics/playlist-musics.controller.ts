import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlaylistMusicsService } from './playlist-musics.service';
import { CreatePlaylistMusicDto } from './dto/create-playlist-music.dto';
import { UpdatePlaylistMusicDto } from './dto/update-playlist-music.dto';

@Controller('playlist-musics')
export class PlaylistMusicsController {
  constructor(private readonly playlistMusicsService: PlaylistMusicsService) {}

  @Post()
  create(@Body() createPlaylistMusicDto: CreatePlaylistMusicDto) {
    return this.playlistMusicsService.create(createPlaylistMusicDto);
  }

  @Get()
  findAll() {
    return this.playlistMusicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistMusicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaylistMusicDto: UpdatePlaylistMusicDto) {
    return this.playlistMusicsService.update(+id, updatePlaylistMusicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistMusicsService.remove(+id);
  }
}
