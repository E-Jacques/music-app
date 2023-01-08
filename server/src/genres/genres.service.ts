import { toGenresDto } from '@/mapper/genres.mapper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenresDto } from './dto/genres.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genres } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genres) private genreRepository: Repository<Genres>,
  ) {}

  create(createGenreDto: CreateGenreDto) {
    return 'This action adds a new genre';
  }

  async findAll(limit: number, offset: number): Promise<GenresDto[]> {
    let o: FindManyOptions<Genres> = {};
    if (limit >= 1) {
      o = {
        skip: offset,
        take: limit,
      };
    }

    const genreList = await this.genreRepository.find(o);

    return genreList.map(toGenresDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} genre`;
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }
}
