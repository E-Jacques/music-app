import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PlaylistDto } from './dto/playlist.dto';
import { extractLimitOffset } from '@/helpers';
import { UsersDto } from '@/users/dto/user.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

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

  @Post('/:playlist-id/add/:music-id')
  @UseGuards(JwtAuthGuard)
  addMusicToPlaylist(
    @Param('playlist-id') playlistId: string,
    @Param('music-id') musicId: string,
    @Req() req: { user: UsersDto },
  ): Promise<void> {
    return this.playlistsService.addMusicToPlaylist(
      +playlistId,
      +musicId,
      req.user,
    );
  }

  @Post('/:playlist-id/remove/:music-id')
  @UseGuards(JwtAuthGuard)
  removeMusicFromPlaylist(
    @Param('playlist-id') playlistId: string,
    @Param('music-id') musicId: string,
    @Req() req: { user: UsersDto },
  ): Promise<void> {
    return this.playlistsService.removeMusicFromPlaylist(
      +playlistId,
      +musicId,
      req.user,
    );
  }
}
