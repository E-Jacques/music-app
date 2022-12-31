import { Injectable } from '@angular/core';
import { UsersDto } from 'src/types/api-dto/UsersDto';
import { IAuthService } from './i-auth.service';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService implements IAuthService {
  constructor() {}

  disconnect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  register({
    lastName,
    firstName,
    email,
    password,
  }: {
    [key: string]: string;
  }): Promise<UsersDto> {
    throw new Error('Method not implemented.');
  }

  isLoggedIn(): boolean {
    throw new Error('Method not implemented.');
  }

  getUser(): UsersDto {
    throw new Error('Method not implemented.');
  }

  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UsersDto> {
    throw new Error('Method not implemented.');
  }
}
