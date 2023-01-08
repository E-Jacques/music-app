import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { extractLimitOffset } from '@/helpers';
import { MusicDto } from './dto/music.dto';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post()
  create(@Body() createMusicDto: CreateMusicDto) {
    return this.musicService.create(createMusicDto);
  }

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

    return this.musicService.findByPlaylistId(playlistId, limit, offset);
  }

  @Get()
  findAll() {
    return this.musicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
    return this.musicService.update(+id, updateMusicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicService.remove(+id);
  }
}
