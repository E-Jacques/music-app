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
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistDto } from './dto/playlist.dto';
import { extractLimitOffset } from '@/helpers';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistsService.create(createPlaylistDto);
  }

  /**
   * /playlists/?limit=<int?>&offset=<int?>
   */
  @Get()
  findAll(@Query() query): Promise<PlaylistDto[]> {
    const { limit, offset } = extractLimitOffset(query);

    return this.playlistsService.findAll(limit, offset);
  }

  /**
   * /playlist/user/:id?limit=<int!>&offset<int!>
   */
  @Get('/user/:id')
  findAllByOwner(
    @Query() query,
    @Param('id') ownerId: string,
  ): Promise<PlaylistDto[]> {
    const { limit, offset } = extractLimitOffset(query);

    return this.playlistsService.findByOwnerId(+ownerId, limit, offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(+id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(+id);
  }
}
