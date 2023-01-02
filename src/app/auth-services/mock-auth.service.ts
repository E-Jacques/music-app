import { Injectable } from '@angular/core';
import { UsersDto } from 'src/types/api-dto/UsersDto';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';
import { IAuthService } from './i-auth.service';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService implements IAuthService {
  private user: UsersDto | null = null;
  private isLoggedInPriv: boolean = false;

  constructor(private apiHandler: MockApiHandlerService) {}

  async disconnect(): Promise<void> {
    this.isLoggedInPriv = false;
    this.user = null;
  }

  async register({
    lastName,
    firstName,
    email,
    password,
    username,
  }: {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    username: string;
  }): Promise<UsersDto> {
    return new Promise(async (r, errf) => {
      this.apiHandler
        .register({ lastName, firstName, email, password, username })
        .then((user) => {
          if (user.username !== username) {
            return errf('Error while trying to register user.');
          }

          return r(user);
        })
        .catch((err) => {
          errf(err.message);
        });
    });
  }

  isLoggedIn(): boolean {
    return this.isLoggedInPriv;
  }

  getUser(): UsersDto | null {
    return this.user;
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UsersDto> {
    return new Promise(async (r, errf) => {
      this.apiHandler
        .login({ email, password })
        .then((user) => {
          this.user = user;
          this.isLoggedInPriv = true;
          return r(user);
        })
        .catch((err) => {
          errf(err.message);
        });
    });
  }
}
