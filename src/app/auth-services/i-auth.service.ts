import { UsersDto } from 'src/types/api-dto/UsersDto';

export interface IAuthService {
  isLoggedIn(): boolean;

  getUser(): UsersDto;

  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UsersDto>;

  disconnect(): Promise<void>;

  register({
    lastName,
    firstName,
    email,
    password,
  }: {
    [key: string]: string;
  }): Promise<UsersDto>;
}
