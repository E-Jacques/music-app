import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistMusicsController } from './playlist-musics.controller';
import { PlaylistMusicsService } from './playlist-musics.service';

describe('PlaylistMusicsController', () => {
  let controller: PlaylistMusicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistMusicsController],
      providers: [PlaylistMusicsService],
    }).compile();

    controller = module.get<PlaylistMusicsController>(PlaylistMusicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
