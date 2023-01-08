import { Module } from '@nestjs/common';
import { PlaylistMusicsService } from './playlist-musics.service';
import { PlaylistMusicsController } from './playlist-musics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlistmusic } from './entities/playlist-music.entity';
import { Playlists } from '@/playlists/entities/playlist.entity';
import { Music } from '@/music/entities/music.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlistmusic, Playlists, Music])],
  controllers: [PlaylistMusicsController],
  providers: [PlaylistMusicsService],
})
export class PlaylistMusicsModule {}
