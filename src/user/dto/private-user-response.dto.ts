import { Users } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class PrivateUserResponseDto {
  @Exclude()
  public password: string;

  @Exclude()
  public email: string;

  @Exclude()
  public email_confirmed: string;

  constructor(user: Users) {
    Object.assign(this, user);
  }
}
