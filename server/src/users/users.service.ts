import { toUserDto } from '@/mapper/users.mapper';
import { Roles } from '@/roles/entities/role.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDto } from './dto/user.dto';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneEntityByUsername(username: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOne(id: number): Promise<UsersDto | null> {
    const userEntity = await this.usersRepository.findOne({
      where: { userid: id },
      relations: {
        role: true,
      },
    });

    if (!userEntity) return null;

    return toUserDto(userEntity);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
