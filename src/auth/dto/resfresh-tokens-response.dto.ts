export class RefreshTokensResponseDto {
  public access_token: string;
  public refresh_token: string;

  constructor(response: RefreshTokensResponseDto) {
    Object.assign(this, response);
  }
}
