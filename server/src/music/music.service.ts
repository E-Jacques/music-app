import { setSkipAndTake } from '@/helpers';
import { toMusicDto } from '@/mapper/music.mapper';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import mp3Parser from 'mp3-parser';
import { Repository } from 'typeorm';
import { MusicDto } from './dto/music.dto';
import { Music } from './entities/music.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music) private musicRepository: Repository<Music>,
  ) {}

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

  async fetchMusicBlock(
    musicId: number,
    blockNumber: number,
    NBlocks: number,
  ): Promise<ArrayBuffer | null> {
    const music = await this.musicRepository.findOne({
      where: { musicid: musicId },
    });
    if (!music || !music.file) {
      throw new HttpException(
        "Music don't exists or file is absent.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const buffer: ArrayBuffer = readFileSync(music.file);
    const dataView = new DataView(buffer);

    const startAt = mp3Parser.readId3v2Tag(dataView)._section.byteLength;
    let i = startAt;
    let start = mp3Parser.readFrame(dataView, i);
    while (!start) {
      i++;
      start = mp3Parser.readFrame(dataView, i);
    }

    for (let j = 0; j < blockNumber; j++) {
      start = mp3Parser.readFrame(dataView, start._section.nextFrameIndex);
    }

    if (start._section.offset > buffer.byteLength) return null;

    let end = start;
    for (
      let j = 0;
      j < NBlocks && mp3Parser.readFrame(dataView, end._section.nextFrameIndex);
      j++
    ) {
      end = mp3Parser.readFrame(dataView, end._section.nextFrameIndex);
    }

    return buffer.slice(
      start._section.offset,
      Math.min(
        end._section.offset + end._section.byteLength,
        buffer.byteLength,
      ),
    );
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
}
