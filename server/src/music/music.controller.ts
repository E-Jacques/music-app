import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { extractLimitOffset } from '@/helpers';
import { MusicDto } from './dto/music.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMusicDto } from './dto/create-music.dto';
import { UsersDto } from '@/users/dto/user.dto';

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

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async submitMusic(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateMusicDto,
    @Req() req: { user: UsersDto },
  ): Promise<number> {
    const music = await this.musicService.create(file, data, req.user);

    return music.musicID;
  }
}
