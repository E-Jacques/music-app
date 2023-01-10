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
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UsersDto> {
    const basicRole = await this.rolesRepository.findOne({
      where: { roleid: 1 },
    });

    const user = this.usersRepository.create({
      ...createUserDto,
      role: basicRole,
    });
    await this.usersRepository.save(user);

    return toUserDto(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneEntityByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { email } });
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
