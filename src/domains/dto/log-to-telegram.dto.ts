import { IsNotEmpty, IsString } from 'class-validator';

export class LogToTelegramChatDto {
  @IsNotEmpty()
  @IsString()
  public m: string;

  @IsNotEmpty()
  @IsString()
  public key: string;
}
