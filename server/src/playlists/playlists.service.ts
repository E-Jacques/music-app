import { setSkipAndTake } from '@/helpers';
import { toPlaylistDto } from '@/mapper/playlist.mapper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PlaylistDto } from './dto/playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlists } from './entities/playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlists)
    private playlistRepository: Repository<Playlists>,
  ) {}

  create(createPlaylistDto: CreatePlaylistDto) {
    return 'This action adds a new playlist';
  }

  async findAll(limit: number, offset: number): Promise<PlaylistDto[]> {
    const playlistList = await this.playlistRepository.find(
      setSkipAndTake({ limit, offset }),
    );

    return playlistList.map(toPlaylistDto);
  }

  async findOne(id: number): Promise<PlaylistDto | null> {
    const playlist = await this.playlistRepository.findOne({
      where: { playlistid: id },
      relations: { user: true },
    });

    if (!playlist) {
      return null;
    }

    return toPlaylistDto(playlist);
  }

  async findByOwnerId(
    ownerId: number,
    limit: number,
    offset: number,
  ): Promise<PlaylistDto[]> {
    const playlistList = await this.playlistRepository.find({
      ...setSkipAndTake({ limit, offset }),
      where: {
        user: {
          userid: ownerId,
        },
      },
      relations: {
        user: true,
      },
    });

    return playlistList.map(toPlaylistDto);
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
