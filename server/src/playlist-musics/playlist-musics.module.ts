import { Module } from '@nestjs/common';
import { PlaylistMusicsService } from './playlist-musics.service';
import { PlaylistMusicsController } from './playlist-musics.controller';

@Module({
  controllers: [PlaylistMusicsController],
  providers: [PlaylistMusicsService]
})
export class PlaylistMusicsModule {}
