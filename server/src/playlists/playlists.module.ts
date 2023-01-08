import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlists } from './entities/playlist.entity';
import { Users } from '@/users/entities/user.entity';
import { Playlistmusic } from '@/playlist-musics/entities/playlist-music.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlists, Users, Playlistmusic])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
