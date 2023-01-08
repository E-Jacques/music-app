import { setSkipAndTake } from '@/helpers';
import { toCommentsDto } from '@/mapper/comments.mapper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comments } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async findByUserId(
    userId: number,
    limit: number,
    offset: number,
  ): Promise<CommentsDto[]> {
    const commentList = await this.commentsRepository.find({
      ...setSkipAndTake({ limit, offset }),
      where: {
        user: {
          userid: userId,
        },
      },
      relations: {
        user: true,
        music: true,
      },
    });

    return commentList.map(toCommentsDto);
  }

  async findByMusicId(
    musicId: number,
    limit: number,
    offset: number,
  ): Promise<CommentsDto[]> {
    const commentList = await this.commentsRepository.find({
      ...setSkipAndTake({ limit, offset }),
      where: {
        music: {
          musicid: musicId,
        },
      },
      relations: {
        user: true,
        music: true,
      },
    });

    return commentList.map(toCommentsDto);
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
