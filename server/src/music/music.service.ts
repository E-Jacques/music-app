import { setSkipAndTake } from '@/helpers';
import { toMusicDto } from '@/mapper/music.mapper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateMusicDto } from './dto/create-music.dto';
import { MusicDto } from './dto/music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { Music } from './entities/music.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music) private musicRepository: Repository<Music>,
  ) {}

  create(createMusicDto: CreateMusicDto) {
    return 'This action adds a new music';
  }

  findAll() {
    return `This action returns all music`;
  }

  async findHits(limit: number, offset: number): Promise<MusicDto[]> {
    // TODO: sort the music list according to views and like. Need to implements some methods in KsqldbConenction.

    const musicList = await this.musicRepository.find({
      ...setSkipAndTake({ limit, offset }),
      relations: {
        user: true,
        genres: true,
        artists: true,
      },
    });

    return musicList.map(toMusicDto);
  }

  async findByPlaylistId(
    playlistId: number,
    limit: number,
    offset: number,
  ): Promise<MusicDto[]> {
    const musics = await this.musicRepository.find({
      ...setSkipAndTake({ limit, offset }),
      where: {
        playlistmusics: {
          playlistid: playlistId,
        },
      },
      relations: {
        user: true,
        genres: true,
        artists: true,
      },
    });

    return musics.map(toMusicDto);
  }

  async findOne(id: number): Promise<MusicDto | null> {
    const music = await this.musicRepository.findOne({
      where: {
        musicid: id,
      },
      relations: {
        user: true,
        genres: true,
        artists: true,
      },
    });

    if (!music) return null;

    return toMusicDto(music);
  }

  async findByGenreId(
    genreId: number,
    limit: number,
    offset: number,
  ): Promise<MusicDto[]> {
    const musics = await this.musicRepository.find({
      where: {
        genres: {
          genreid: genreId,
        },
      },
      relations: {
        user: true,
        genres: true,
        artists: true,
      },
      ...setSkipAndTake({ limit, offset }),
    });

    return musics.map(toMusicDto);
  }

  update(id: number, updateMusicDto: UpdateMusicDto) {
    return `This action updates a #${id} music`;
  }

  remove(id: number) {
    return `This action removes a #${id} music`;
  }
}
