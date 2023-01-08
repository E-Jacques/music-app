import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersDto } from '@/users/dto/user.dto';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInputDto } from './dto/login-input.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() body: LoginInputDto) {
    return this.authService.login(body);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() body: CreateUserDto): Promise<UsersDto> {
    return this.authService.register(body);
  }
}
