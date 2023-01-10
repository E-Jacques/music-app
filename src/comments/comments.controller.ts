import { extractLimitOffset } from '@/helpers';
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
import { CommentsService } from './comments.service';
import { CommentsDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('/user/:id')
  findByUserId(@Param('id') userId: string, @Query() query) {
    const { limit, offset } = extractLimitOffset(query);

    return this.commentsService.findByUserId(+userId, limit, offset);
  }
  @Get('/music/:id')
  findByMusicId(
    @Param('id') musicId: string,
    @Query() query,
  ): Promise<CommentsDto[]> {
    const { limit, offset } = extractLimitOffset(query);

    return this.commentsService.findByMusicId(+musicId, limit, offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}