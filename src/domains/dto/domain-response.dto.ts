import { Domains } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class DomainResponseDto {
  @Exclude()
  public path: string;

  constructor(domain: Domains) {
    Object.assign(this, domain);
  }
}
