import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { extractLimitOffset } from '@/helpers';
import { MusicDto } from './dto/music.dto';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get('hits')
  fetchAllHits(@Query() query) {
    const { limit, offset } = extractLimitOffset(query);

    return this.musicService.findHits(limit, offset);
  }

  @Get('/playlist/:id')
  findByPlaylistId(
    @Param('id') playlistId: string,
    @Query() query,
  ): Promise<MusicDto[]> {
    const { limit, offset } = extractLimitOffset(query);

    return this.musicService.findByPlaylistId(+playlistId, limit, offset);
  }

  @Get('/genres/:id')
  findByGenreId(
    @Param('id') genreId: string,
    @Query() query,
  ): Promise<MusicDto[]> {
    const { limit, offset } = extractLimitOffset(query);

    return this.musicService.findByGenreId(+genreId, limit, offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(+id);
  }

  @Get('/:id/mpeg-block/?block-nb')
  getMPEGBlock(
    @Param('id') musicId: string,
    @Query() query,
  ): Promise<ArrayBuffer | null> {
    const { blocknumber, nblocks } = query;
    if (!blocknumber || !nblocks) {
      throw new HttpException(
        "Missing 'blocknumber' or 'nblocks' queryparams.",
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.musicService.fetchMusicBlock(+musicId, +blocknumber, +nblocks);
  }
}
