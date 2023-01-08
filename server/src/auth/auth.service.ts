import { toUserDto } from '@/mapper/users.mapper';
import { UsersDto } from '@/users/dto/user.dto';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    rawPassword: string,
  ): Promise<UsersDto | null> {
    const user = await this.userService.findOneEntityByUsername(username);
    if (user && (await this.comparePassword(rawPassword, user.password))) {
      return toUserDto(user);
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async comparePassword(
    rawPassword: string,
    hashedPassord: string,
  ): Promise<boolean> {
    return await compare(rawPassword, hashedPassord);
  }
}
