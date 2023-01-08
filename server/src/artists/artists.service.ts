import { toArtistsDto } from '@/mapper/artists.mapper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ArtistsDto } from './dto/artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artists } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artists) private artistsRepository: Repository<Artists>,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    return 'This action adds a new artist';
  }

  async findAll(limit: number, offset: number): Promise<ArtistsDto[]> {
    let o: FindManyOptions<Artists> = {};
    if (limit >= 1) {
      o = {
        skip: limit,
        take: offset,
      };
    }

    const artistList = await this.artistsRepository.find(o);

    return artistList.map(toArtistsDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} artist`;
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
