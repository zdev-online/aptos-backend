import { Users } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @Exclude()
  public password: string;

  constructor(user: Users) {
    Object.assign(this, user);
  }
}
