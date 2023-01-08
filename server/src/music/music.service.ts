import { randomString, setSkipAndTake } from '@/helpers';
import { toMusicDto } from '@/mapper/music.mapper';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync, writeFileSync } from 'fs';
import mp3Parser from 'mp3-parser';
import { Repository } from 'typeorm';
import { MusicDto } from './dto/music.dto';
import { Music } from './entities/music.entity';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { CreateMusicDto } from './dto/create-music.dto';
import { UsersDto } from '@/users/dto/user.dto';
import { ArtistsService } from '@/artists/artists.service';
import { GenresService } from '@/genres/genres.service';
import { ArtistsDto } from '@/artists/dto/artist.dto';
import { GenresDto } from '@/genres/dto/genres.dto';
dotenv.config();

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music) private musicRepository: Repository<Music>,
    private artistService: ArtistsService,
    private genreService: GenresService,
  ) {}

  async create(
    file: Express.Multer.File,
    createMusic: CreateMusicDto,
    user: UsersDto,
  ): Promise<MusicDto> {
    if (file.mimetype !== 'audio/mpeg') {
      throw new HttpException(
        "Incorrect mimetype. Expected 'audio/mpeg', got " + file.mimetype + '.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const filepath = join(
      process.env.AUDIO_FILE_DIRPATH,
      `${createMusic.title}-${randomString(8)}.mp3`,
    );
    const arrayBuffer = file.buffer;
    await writeFileSync(filepath, new DataView(arrayBuffer));

    const artists: ArtistsDto[] = [];
    for (const artistId of createMusic.artists) {
      const artist = await this.artistService.findOne(artistId);
      if (!artist)
        throw new HttpException(
          `artist with id ${artistId} don't exists.`,
          HttpStatus.BAD_REQUEST,
        );

      artists.push(artist);
    }

    const genres: GenresDto[] = [];
    for (const genreId of createMusic.genres) {
      const genre = await this.genreService.findOne(genreId);
      if (!genre)
        throw new HttpException(
          `genre with id ${genreId} don't exists.`,
          HttpStatus.BAD_REQUEST,
        );

      genres.push(genre);
    }

    const music = this.musicRepository.create({
      file: filepath,
      title: createMusic.title,
      description: createMusic.title,
      turnoffcomments: createMusic.turnoffcomments,
      artists,
      genres,
      user,
    });

    await this.musicRepository.save(music);
    return toMusicDto(music);
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
