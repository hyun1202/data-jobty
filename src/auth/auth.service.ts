import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from "../users/users.repository";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  async signUp(authCredentialsDto : AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }
}
