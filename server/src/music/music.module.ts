import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Music } from './entities/music.entity';
import { Users } from '@/users/entities/user.entity';
import { Comments } from '@/comments/entities/comment.entity';
import { Artists } from '@/artists/entities/artist.entity';
import { Genres } from '@/genres/entities/genre.entity';
import { Playlistmusic } from '@/playlist-musics/entities/playlist-music.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Music,
      Users,
      Comments,
      Artists,
      Genres,
      Playlistmusic,
    ]),
  ],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
